import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from '../../point/entities/point.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

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

  // 현재 시간이 안나온다면 해당 db에서 설정, ALTER TABLE User MODIFY COLUMN create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  deletedAt?: Date;

  // Point(포인트) 테이블과 1:N 관계 설정
  @OneToMany(() => Point, (point) => point.user)
  point: Point[];

  // Performance(공연) 테이블과 1:N 관계 설정
  @OneToMany(() => Performance, (performance) => performance.user)
  performance: Performance[];

  // Reservation(예매) 테이블과 1:N 관계 설정
  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation[];
}
