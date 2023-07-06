import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from '../response.dto';
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
  async getAllCategories(
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<Category[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDto<Category[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDto<Category[]>(
        await this.categoryService.getAllCategories(),
      );
    } else return new ResponseDto<Category[]>(null);
  }
}
