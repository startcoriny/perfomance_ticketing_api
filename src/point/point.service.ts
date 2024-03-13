import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from './entities/point.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}

  // 포인트 세팅
  async setPoint(user: User, point: number) {
    await this.pointRepository.save({
      userId: user.id,
      point: point,
    });
  }

  async checkPoint(userId: bigint) {
    return await this.pointRepository.findOne({
      where: { userId },
    });
  }
}
