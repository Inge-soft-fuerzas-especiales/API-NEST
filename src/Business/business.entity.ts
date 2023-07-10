import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../User/user.entity';
import { Membership } from '../Membership/memebership.entity';

export enum BusinessRole {
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
  SUBSCRIBED = 'subscribed',
}

@Entity()
export class Business {
  @PrimaryColumn({ type: 'bigint' })
  cuit: number;

  @OneToOne(() => Membership, (membership) => membership.business, {
    eager: false,
  })
  membership: Membership;

  @OneToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  owner: User;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: BusinessRole,
    default: BusinessRole.UNVERIFIED,
  })
  role: BusinessRole;
}
