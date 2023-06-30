import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../User/user.entity';
import { Post } from '../Post/post.entity';
import { Offer } from '../Offer/offer.entity';
import { Membership } from '../Membership/memebership.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Membership, (membership) => membership.business)
  membership: Membership;

  @OneToOne(() => User, (user) => user.owns, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  owner: User;

  @Column({ unique: true })
  name: string;

  @Column({
    unique: true,
    type: 'bigint',
  })
  cuit: number;

  @OneToMany(() => User, (user) => user.employedAt)
  employees: User[];

  @OneToMany(() => Post, (post) => post.business)
  posts: Post[];

  @OneToMany(() => Offer, (offer) => offer.business)
  offers: Offer[];

  @Column({ default: false })
  verified: boolean;
}
