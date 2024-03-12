import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetailReservation } from './detailReservation.entity';

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'bigint', name: 'userId', nullable: false })
  userId: bigint;

  @Column({ type: 'bigint', nullable: false })
  totalPrice: bigint;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createAt: Date;

  @OneToMany(
    () => DetailReservation,
    (detailReservation) => detailReservation.reservation,
  )
  detailReservation: DetailReservation[];

  @ManyToOne(() => User, (user) => user.reservation)
  @JoinColumn({ name: 'userId' })
  user: User;
}
