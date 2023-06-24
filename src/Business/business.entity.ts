import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../User/user.entity';
import { Post } from '../Post/post.entity';
import { Offer } from '../Offer/offer.entity';
import { Membership } from '../Membership/memebership.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Membership, (membership) => membership.business, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  membership: Membership;

  @OneToOne(() => User, (user) => user.owns, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  owner: User;

  @Column({
    nullable: true,
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
    unique: true,
  })
  cuit: number;

  @OneToMany(() => User, (user) => user.employedAt)
  employees: User[];

  @OneToMany(() => Post, (post) => post.business)
  posts: Post[];

  @OneToMany(() => Offer, (offer) => offer.business)
  offers: Offer[];
}
