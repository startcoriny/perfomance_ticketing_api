import { Performance } from 'src/performance/entities/performance.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity({
  name: 'detailReservations',
})
export class DetailReservation {
  @PrimaryGeneratedColumn()
  id: bigint;

  @ManyToOne(() => Performance, (performance) => performance.detailReservation)
  @JoinColumn({ name: 'performanceId' })
  performance: Performance;

  @Column({ type: 'bigint', name: 'performanceId', nullable: false })
  performanceId: bigint;

  @ManyToOne(
    () => Reservation,
    (reservation) => reservation.detailReservation,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @Column({ type: 'bigint', name: 'reservationId', nullable: false })
  reservationId: bigint;

  @Column({ type: 'datetime', nullable: false })
  reservationDay: Date;

  @Column({ type: 'int', nullable: false })
  seatCount: number;
}
