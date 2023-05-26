import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Business } from '../Business/business.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ unique: true })
  authz_id: string;

  @ManyToOne(() => Business, (business) => business.employees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'business' })
  employed_at: Business;

  @OneToOne(() => Business, (business) => business.owner)
  owns: Business;
}
