import { DeepPartial } from 'typeorm';
import { Post } from './post.entity';

export class CreateOfferDto {
  owner_id: number;
  post: DeepPartial<Post>;
  budget: number;
  price: number;
  additional_information: string;
}
