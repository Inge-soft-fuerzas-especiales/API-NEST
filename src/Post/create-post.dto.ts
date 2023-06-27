import { DeepPartial } from 'typeorm';
import { Category } from '../Category/category.entity';
import { Business } from '../Business/business.entity';

export class CreatePostDto {
  business: DeepPartial<Business>;
  category: DeepPartial<Category>;
  item: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: Date;
}
