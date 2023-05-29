import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Offer } from '../Offer/offer.entity';
import { Business } from '../Business/business.entity';
import { Category } from '../Category/category.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  id: number;

  @ManyToOne(() => Business, (business) => business.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @OneToMany(() => Offer, (offer) => offer.post)
  offers: Offer[];

  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  item: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'money' })
  budget_min: number;

  @Column({ type: 'money' })
  budget_max: number;

  @Column()
  deadline: Date;
}
