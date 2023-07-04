import { Post } from '../Post/post.entity';
import { Business } from '../Business/business.entity';
import { Category } from '../Category/category.entity';

export class SearchDto {
  objectID: string;
  item: string;
  category: Category;
  business: Business;
  budgetMin: number;
  budgetMax: number;
  description: string;
  deadline: Date;
}

export function searchToPost(search: SearchDto): Post {
  return {
    id: parseInt(search.objectID, 10),
    ...search,
  };
}

export function postToSearch(post: Post): SearchDto {
  return {
    objectID: post.id.toString(10),
    ...post,
  };
}
