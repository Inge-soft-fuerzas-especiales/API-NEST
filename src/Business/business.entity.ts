import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../User/user.entity';
import { Post } from '../Post/post.entity';
import { Offer } from '../Offer/offer.entity';
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

  @OneToOne(() => Membership, (membership) => membership.business)
  membership: Membership;

  @OneToOne(() => User, (user) => user.owns, {
    nullable: false,
    onDelete: 'RESTRICT',
    cascade: true,
  })
  @JoinColumn()
  owner: User;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.employedAt)
  employees: User[];

  @OneToMany(() => Post, (post) => post.business)
  posts: Post[];

  @OneToMany(() => Offer, (offer) => offer.business)
  offers: Offer[];

  @Column({
    type: 'enum',
    enum: BusinessRole,
    default: BusinessRole.UNVERIFIED,
  })
  role: BusinessRole;
}
