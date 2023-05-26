import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Business } from '../Business/business.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn({ name: 'membership_id' })
  id: number;

  @OneToOne(() => Business, (business) => business.membership)
  business: Business;

  @Column()
  expiration_date: Date;

  @Column()
  level: number;
}
