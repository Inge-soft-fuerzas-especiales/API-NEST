import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDataDto } from '../response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll(): Promise<ResponseDataDto<Category[]>> {
    return new ResponseDataDto<Category[]>(await this.categoryService.getAll());
  }

  @Get(':categoryId')
  async getById(
    @Param('categoryId') categoryId: number,
  ): Promise<ResponseDataDto<Category>> {
    return new ResponseDataDto<Category>(
      await this.categoryService.getById(categoryId),
    );
  }
}
