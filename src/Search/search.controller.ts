import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { Post as _Post } from '../Post/post.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { ResponseDto } from '../response.dto';
import { BusinessRole } from '../Business/business.entity';
import { SearchService } from './search.service';
import { searchToPost } from './search.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('search')
export class SearchController {
  constructor(
    private readonly authzService: AuthzService,
    private readonly algoliaService: SearchService,
  ) {}

  @Post()
  async search(
    @Body() { query: query }: { query: string },
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<_Post[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDto<_Post[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      const hits = await this.algoliaService.search(query);
      return new ResponseDto<_Post[]>(hits.map((hit) => searchToPost(hit)));
    } else return new ResponseDto<_Post[]>(null);
  }
}
