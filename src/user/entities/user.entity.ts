import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'datetime' })
  createAt: Date;

  @Column({ type: 'datetime', nullable: true })
  deleteAt: Date;
}
