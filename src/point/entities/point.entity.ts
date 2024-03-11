import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({
  name: 'points',
})
export class Point {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'bigint', name: 'userId' })
  userId: bigint;

  @Column({ type: 'bigint', nullable: false })
  point: number;

  @Column({ type: 'varchar', default: '첫 가입 포인트 지급', nullable: false })
  pointHistory: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createAt: Date;

  @ManyToOne(() => User, (user) => user.point, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
