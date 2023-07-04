import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../Business/business.entity';
import { Category } from '../Category/category.entity';

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
}
