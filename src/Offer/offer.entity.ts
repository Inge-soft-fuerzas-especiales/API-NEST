import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from '../Post/post.entity';
import { Business } from '../Business/business.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business) => business.offers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  business: Business;

  @ManyToOne(() => Post, (post) => post.offers, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  post: Post;

  @Column()
  price: number;

  @Column({ type: 'text' })
  description: string;
}
