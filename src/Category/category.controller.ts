import { Controller, Get, Headers, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDataDto } from '../response.dto';
import { AuthzService } from '../Authz/authz.service';
import { BusinessRole } from '../Business/business.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly authzService: AuthzService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  async getAll(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<Category[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDataDto<Category[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDataDto<Category[]>(
        await this.categoryService.getAll(),
      );
    } else return new ResponseDataDto<Category[]>(null);
  }

  @Get(':categoryId')
  async getById(
    @Headers('authorization') authorization,
    @Param('categoryId') categoryId: number,
  ): Promise<ResponseDataDto<Category>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDataDto<Category>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDataDto<Category>(
        await this.categoryService.getById(categoryId),
      );
    } else return new ResponseDataDto<Category>(null);
  }
}
