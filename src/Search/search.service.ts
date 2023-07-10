import algolia, { SearchClient, SearchIndex } from 'algoliasearch';
import { Injectable } from '@nestjs/common';
import { SearchDto } from './search.dto';

@Injectable()
export class SearchService {
  private client: SearchClient;
  private index: SearchIndex;

  constructor() {
    this.client = algolia(process.env.ALGOLIA_ID, process.env.ALGOLIA_KEY);
    this.index = this.client.initIndex(process.env.ALGOLIA_INDEX);
  }

  async search(query: string) {
    const { hits } = await this.index.search<SearchDto>(query);
    return hits;
  }

  async saveObject(algoliaDto: SearchDto) {
    return this.index.saveObject(algoliaDto);
  }

  async deleteObject(objectId: string) {
    return this.index.deleteObject(objectId);
  }
}
