import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { Seat } from './entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Performance, Seat])],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
