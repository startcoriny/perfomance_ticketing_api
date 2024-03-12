import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Performance } from './performance.entity';

@Entity({
  name: 'seats',
})
export class Seat {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'bigint', name: 'performanceId', nullable: false })
  performanceId: bigint;

  @Column({ type: 'int', nullable: false })
  seatNum: number;

  @Column({ type: 'varchar', nullable: false })
  grade: string;

  @Column({ type: 'bigint', nullable: false })
  price: bigint;

  @Column({ type: 'boolean', default: false, nullable: false })
  isReserved: boolean;

  // 관계지정해야함. performanceId
  @ManyToOne(() => Performance, (performance) => performance.seat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'performanceId' })
  performance: Performance;
}
