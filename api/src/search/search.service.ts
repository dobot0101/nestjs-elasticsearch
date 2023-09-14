import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  private readonly indexName = 'products';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search(query: string) {
    const { hits } = await this.elasticsearchService.search({
      index: this.indexName,
      body: {
        query: {
          // match: {
          //   query,
          // },
          multi_match: {
            query,
            fields: ['title', 'modifier', 'search_keyword'],
          },
        },
      },
    });

    console.log(hits.hits);

    return hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
    }));
  }

  async getAllDocuments() {
    const { hits } = await this.elasticsearchService.search({
      index: this.indexName,
      query: {
        match_all: {},
      },
    });

    return hits.hits;
  }
}
