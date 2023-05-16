import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Offer } from './offer.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  owner_id: number;

  @OneToMany(() => Offer, (offer) => offer.post)
  offers: Offer[];

  @Column()
  item: string;

  @Column()
  description: string;

  @Column()
  budget_min: number;

  @Column()
  budget_max: number;
}
