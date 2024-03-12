import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { Point } from 'src/point/entities/point.entity';
import { DetailReservation } from './entities/detailReservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Performance,
      Point,
      DetailReservation,
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
