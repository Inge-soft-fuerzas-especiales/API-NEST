import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../Business/business.entity';
import { Category } from '../Category/category.entity';
import { Offer } from '../Offer/offer.entity';

export enum PostState {
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  business: Business;

  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn()
  category: Category;

  @Column()
  item: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  budgetMin: number;

  @Column()
  budgetMax: number;

  @Column({ type: 'date' })
  deadline: Date;

  @OneToOne(() => Offer, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinColumn()
  selected: Offer;

  @Column({ type: 'enum', enum: PostState, default: PostState.OPEN })
  state: PostState;
}
