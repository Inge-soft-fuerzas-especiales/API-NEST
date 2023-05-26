import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../User/user.entity';
import { Post } from '../Post/post.entity';
import { Offer } from '../Offer/offer.entity';
import { Membership } from '../Membership/memebership.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn({ name: 'business_id' })
  id: number;

  @OneToOne(() => Membership, (membership) => membership.business, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'membership_id' })
  membership: Membership;

  @OneToOne(() => User, (user) => user.owns, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @OneToMany(() => User, (user) => user.employed_at)
  employees: User[];

  @OneToMany(() => Post, (post) => post.business)
  posts: Post[];

  @OneToMany(() => Offer, (offer) => offer.business)
  offers: Offer[];
}
