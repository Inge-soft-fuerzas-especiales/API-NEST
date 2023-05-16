import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity({ name: 'Offer' })
export class Offer {
  @PrimaryGeneratedColumn()
  offer_id: number;

  @Column()
  owner_id: number;

  @ManyToOne(() => Post, (post) => post.offers)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column()
  price: number;

  @Column()
  additional_information: string;

  @Column()
  budget: number;
}
