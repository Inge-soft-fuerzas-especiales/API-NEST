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
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business) => business.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  business: Business;

  @OneToMany(() => Offer, (offer) => offer.post)
  offers: Offer[];

  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
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
}
