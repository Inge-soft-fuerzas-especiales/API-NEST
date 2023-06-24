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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  authz_id: string;

  @Column({
    nullable: true,
    unique: true,
  })
  dni: number;

  @ManyToOne(() => Business, (business) => business.employees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  employedAt: Business;

  @OneToOne(() => Business, (business) => business.owner)
  owns: Business;
}
