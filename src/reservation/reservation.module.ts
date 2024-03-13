import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { DetailReservation } from './entities/detailReservation.entity';
import { Seat } from 'src/performance/entities/seat.entity';
import { PointModule } from 'src/point/point.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Performance,
      DetailReservation,
      Seat,
    ]),
    PointModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
