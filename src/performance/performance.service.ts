import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { Like, Repository } from 'typeorm';
import { Category } from './types/categoryRole.type';
import _ from 'lodash';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
  ) {}

  async create(
    userId: bigint,
    name: string,
    content: string,
    date: Date,
    place: string,
    seat: number,
    image: string,
    category: Category,
  ) {
    return (
      await this.performanceRepository.save({
        name,
        userId: userId,
        content,
        date,
        place,
        seat,
        image,
        category: category,
      })
    ).id;
  }

  async findAll(): Promise<Performance[]> {
    return await this.performanceRepository.find({
      select: ['id', 'name', 'content', 'category'],
    });
  }

  async search(name: string) {
    return await this.performanceRepository.find({
      select: ['id', 'name', 'content', 'category'],
      where: { name: Like(`%${name}%`) }, // % : 와일드카드 문자열,  검색어와 부분적으로 일치하는 모든 결과를 반환
    });
  }

  async findOne(id: bigint) {
    return await this.verifyPerformanceById(id);
  }

  async verifyPerformanceById(id: bigint) {
    const performance = await this.performanceRepository.findOneBy({ id });
    if (_.isNil(performance)) {
      throw new NotFoundException('존재하지 않는 공연입니다.');
    }
    return performance;
  }
}
