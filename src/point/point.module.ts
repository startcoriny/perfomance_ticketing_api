import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './entities/point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  exports: [TypeOrmModule],
})
export class PointModule {}
