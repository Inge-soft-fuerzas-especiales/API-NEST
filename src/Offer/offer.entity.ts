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
  @PrimaryGeneratedColumn({ name: 'offer_id' })
  id: number;

  @ManyToOne(() => Business, (business) => business.offers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => Post, (post) => post.offers, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column()
  price: number;

  @Column({ type: 'text' })
  additional_information: string;
}
