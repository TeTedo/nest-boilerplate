import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from 'src/common/entities/base-time.entity';

@Entity()
export class Member extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
}
