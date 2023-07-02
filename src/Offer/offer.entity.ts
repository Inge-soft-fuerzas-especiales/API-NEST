import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../Post/post.entity';
import { Business } from '../Business/business.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  business: Business;

  @ManyToOne(() => Post, {
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
