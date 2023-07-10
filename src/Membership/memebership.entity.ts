import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../Business/business.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Business, (business) => business.membership, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  business: Business;

  @Column()
  expiration: Date;

  @Column()
  level: number;
}
