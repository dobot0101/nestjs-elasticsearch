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
          bool: {
            should: [
              {
                multi_match: {
                  query,
                  fields: [
                    'analyzed_title',
                    'analyzed_modifier',
                    'analyzed_search_keyword',
                  ],
                  minimum_should_match: 2,
                },
              },
              {
                multi_match: {
                  query,
                  fields: [
                    'title',
                    'modifier',
                    'search_keyword',
                    'title.ngram',
                    'modifier.ngram',
                    'search_keyword.ngram',
                  ],
                },
              },
            ],
          },
        },
      },
    });


    return hits.hits.map((hit: any) => ({
      documentId: hit._id,
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
