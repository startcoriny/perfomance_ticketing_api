import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { Point } from 'src/point/entities/point.entity';
import { DetailReservation } from './entities/detailReservation.entity';
import { Seat } from 'src/performance/entities/seat.entity';
import { PointService } from 'src/point/point.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(DetailReservation)
    private readonly dataSource: DataSource,
    private readonly pointService: PointService,
  ) {}

  // 예매하기
  async buyTicket(performanceId: bigint, userId: bigint, seatNum: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); // 격리수준 설정.
    try {
      /* 순서
          1. 예매하려는 공연의 잔여 좌석 조회 , 좌석이 없다면 에러 던짐
          2. 예매하려는 공연의 가격과 유저의 포인트를 비교, 포인트가 공연가격보다 낮다면 에러던짐
          3. 트랜잭션
          4. 예매시 총 좌석(performance) - 예매한 좌석의 갯수(detailReservation). = 남은 좌석의 갯수 업데이트
          5. 예매시 유저의 포인트에서 차감 user.point - seat.price
      */

      let performance: Performance = await queryRunner.manager
        .getRepository(Performance)
        .findOne({
          where: { id: performanceId },
        });

      if (0 >= performance.totalSeat) {
        throw new NotFoundException('남은 좌석이 존재하지 않습니다.');
      }

      // 지정한 자리 찾기
      let seat = await this.seatRepository.findOne({
        where: { seatNum },
      });

      if (seat.isReserved === true) {
        throw new ConflictException('이미 예매된 좌석 입니다.');
      }

      let point = await this.pointService.checkPoint(userId);

      if (Number(point.point) < Number(seat.price)) {
        throw new BadRequestException('잔액이 부족합니다.');
      }

      // 사용자가 선택한 공연저장 (이름, 날짜, 장소)
      const reservation = await queryRunner.manager
        .getRepository(Reservation)
        .save({
          userId: userId,
          totalPrice: BigInt(seat.price),
        });

      // 예매정보 저장
      await queryRunner.manager.getRepository(DetailReservation).save({
        reservationId: reservation.id,
        performanceId: performanceId,
        reservationDay: performance.date,
        seatCount: 1, // 일단 1
      });

      // 좌석 정보 저장
      await queryRunner.manager
        .getRepository(Seat)
        .update({ seatNum }, { isReserved: true });

      // 총 좌석 갯수
      const totSeatCount = await queryRunner.manager
        .getRepository(Seat)
        .count();

      // 총 몇자리가 예매됬는지 확인
      const totIsReservationCount = await queryRunner.manager
        .getRepository(Seat)
        .count({
          where: { isReserved: true },
        });

      // const updateSeat = performance.seat - count;

      // 남은 자리 업데이트
      await queryRunner.manager
        .getRepository(Performance)
        .update(
          { id: performanceId },
          { totalSeat: totSeatCount - totIsReservationCount },
        );

      // 포인트 차감
      let minPoint = seat.price;
      await queryRunner.manager.getRepository(Point).update(
        { userId: userId },
        {
          point: point.point - Number(minPoint),
          pointHistory: `${performance.name}공연 결제 완료`,
        },
      );
      await queryRunner.commitTransaction();

      return await this.performanceRepository.find({
        select: ['name', 'content', 'category', 'date'],
        where: { id: performanceId },
      });
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.error(e);
    } finally {
      await queryRunner.release();
    }
  }

  // 예매 목록확인
  async findReservation(id: bigint) {
    try {
      // detailReservation과 reservation을 조인
      // 유저 아이디를 통해서 예매 내역들 가져오기
      const reservation = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.detailReservation', 'detailReservation')
        .select([
          'reservation.id',
          'reservation.userId',
          'reservation.totalPrice',
          'detailReservation.performanceId',
        ])
        .where('reservation.userId = :id', { id })
        .getRawMany(); // 엔티티에 대한 원시 데이터가 포함된 배열이 반환

      // 예매 내역의 공연 아이디를 통해 제목, 내용, 시간, 카테고리 가져오기
      const performanceInfo = await Promise.all(
        reservation.map(async (RowDataPacket) => {
          const performanceInfos = await this.performanceRepository.find({
            select: ['name', 'content', 'date', 'place', 'category'],
            where: { id: RowDataPacket.detailReservation_performanceId },
          });
          return performanceInfos;
        }),
      );

      return performanceInfo;
    } catch (e) {
      throw new Error('내역을 찾을수가 없습니다.');
    }
  }
}
