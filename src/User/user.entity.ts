import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Business } from '../Business/business.entity';

export enum UserRole {
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
  OWNER = 'owner',
  EMPLOYEE = 'employee',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryColumn({ type: 'bigint' })
  dni: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ unique: true })
  authzId: string;

  @ManyToOne(() => Business, (business) => business.employees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  employedAt: Business;

  @OneToOne(() => Business, (business) => business.owner)
  owns: Business;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.UNVERIFIED })
  role: UserRole;
}
