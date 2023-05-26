import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Business } from '../Business/business.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @ManyToOne(() => Business, (business) => business.employees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'business' })
  employed_at: Business;

  @OneToOne(() => Business, (business) => business.owner)
  owns: Business;
}
