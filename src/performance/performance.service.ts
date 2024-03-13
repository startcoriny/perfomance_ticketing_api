import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { Like, Repository } from 'typeorm';
import { Category } from './types/categoryRole.type';
import _ from 'lodash';
import { Seat } from './entities/seat.entity';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  // 공연 생성 -> 좌석 같이 생성?
  async create(userId: bigint, createPerformanceDto: CreatePerformanceDto) {
    const performance = await this.performanceRepository.findOne({
      where: {
        name: createPerformanceDto.name,
        date: createPerformanceDto.date,
      },
    });

    if (performance) {
      throw new ConflictException('해당 공연은 이미 존재합니다.');
    }

    // 공연 만들기
    const performanceId = (
      await this.performanceRepository.save({
        name: createPerformanceDto.name,
        userId: userId,
        content: createPerformanceDto.content,
        date: createPerformanceDto.date,
        place: createPerformanceDto.place,
        totalSeat: createPerformanceDto.seat,
        image: createPerformanceDto.image,
        category: createPerformanceDto.category,
      })
    ).id;

    // 좌석 세팅하기
    for (let seatNum = 1; seatNum <= createPerformanceDto.seat; seatNum++) {
      let grade = null;
      let price = 0;
      if (seatNum <= 10) {
        grade = 'A';
        price = 30000;
      } else if (seatNum > 10) {
        grade = 'B';
        price = 60000;
      }
      await this.seatRepository.save({
        performanceId,
        seatNum,
        grade,
        price: BigInt(price),
      });
    }

    return performanceId;
  }

  // 공연 조회
  async findAll(): Promise<Performance[]> {
    return await this.performanceRepository.find({
      select: ['id', 'name', 'content', 'category'],
    });
  }

  // 공연검색
  async search(name: string) {
    return await this.performanceRepository.find({
      select: ['id', 'name', 'content', 'category'],
      where: { name: Like(`%${name}%`) }, // % : 와일드카드 문자열,  검색어와 부분적으로 일치하는 모든 결과를 반환
    });
  }

  // 공연 상세조회
  async findOne(id: bigint) {
    return await this.verifyPerformanceById(id);
  }

  // 공연 검증.
  async verifyPerformanceById(id: bigint) {
    const performance = await this.performanceRepository.findOneBy({ id });
    if (_.isNil(performance)) {
      throw new NotFoundException('존재하지 않는 공연입니다.');
    }
    return performance;
  }
}
