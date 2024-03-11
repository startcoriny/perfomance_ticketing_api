import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Category } from '../types/categoryRole.type';
import { User } from 'src/user/entities/user.entity';

@Entity({
  name: 'performances',
})
// 동일한 날짜와 시간에 동일한 이름의 공연은 있을수 없다.
@Unique(['name', 'date'])
export class Performance {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'bigint', name: 'userId', nullable: false })
  userId: bigint;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'datetime', nullable: false })
  date: Date;

  @Column({ type: 'varchar', nullable: false })
  place: string;

  @Column({ type: 'int', nullable: false })
  seat: number;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ type: 'enum', enum: Category, nullable: false })
  category: Category;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createAt: Date;

  @Column({ type: 'datetime', nullable: true })
  deadline: Date;

  @ManyToOne(() => User, (user) => user.performance)
  @JoinColumn({ name: 'userId' })
  user: User;
}
