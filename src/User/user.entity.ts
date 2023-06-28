import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../Business/business.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  authzId: string;

  @Column({ unique: true })
  dni: number;

  @ManyToOne(() => Business, (business) => business.employees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  employedAt: Business;

  @OneToOne(() => Business, (business) => business.owner)
  owns: Business;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  admin: boolean;
}
