export class CreatePostDto {
  owner_id: number;
  item: string;
  description: string;
  budget_min: number;
  budget_max: number;
}
