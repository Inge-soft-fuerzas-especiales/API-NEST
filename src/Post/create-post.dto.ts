export class CreatePostDto {
  categoryId: number;
  item: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: Date;
}
