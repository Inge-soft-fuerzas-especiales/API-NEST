import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Business } from '../Business/business.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Business, (business) => business.membership)
  business: Business;

  @Column()
  expiration: Date;

  @Column()
  level: number;
}
