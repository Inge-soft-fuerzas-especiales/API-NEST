import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { ResponseDataDto } from '../response.dto';
import { BusinessRole } from '../Business/business.entity';
import { SearchService } from './search.service';

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
  ) {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDataDto(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDataDto(await this.algoliaService.search(query));
    } else return new ResponseDataDto(null);
  }
}
