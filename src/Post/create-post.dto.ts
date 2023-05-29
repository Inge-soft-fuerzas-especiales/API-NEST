import { DeepPartial } from 'typeorm';
import { Category } from '../Category/category.entity';
import { Business } from '../Business/business.entity';

export class CreatePostDto {
  business: DeepPartial<Business>;
  category: DeepPartial<Category>;
  item: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: Date;
}
