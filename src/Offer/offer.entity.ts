import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../Post/post.entity';
import { Business } from '../Business/business.entity';

export enum OfferState {
  OPEN = 'open',
  CANCELLED = 'cancelled',
}

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  business: Business;

  @ManyToOne(() => Post, {
    nullable: false,
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinColumn()
  post: Post;

  @Column()
  price: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: OfferState, default: OfferState.OPEN })
  state: OfferState;
}
