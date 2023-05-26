import { DeepPartial } from 'typeorm';
import { Post } from '../Post/post.entity';
import { Business } from '../Business/business.entity';

export class CreateOfferDto {
  business: DeepPartial<Business>;
  post: DeepPartial<Post>;
  price: number;
  additional_information: string;
}
