import { timeStamp } from 'console';
import { date } from 'joi';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Point } from '../../point/entities/point.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  nickName: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isAdmin: boolean;

  // 해당 db에서 설정, ALTER TABLE User MODIFY COLUMN create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  create_at: Date;

  @Column({ type: 'datetime', nullable: true })
  delete_At?: Date;

  @OneToMany(() => Point, (point) => point.user)
  point: Point[];
}
