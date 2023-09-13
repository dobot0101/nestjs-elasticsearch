import { randomUUID } from 'crypto';
import { Injectable } from 'node_modules/@nestjs/common';
import { ElasticsearchService } from 'node_modules/@nestjs/elasticsearch';

@Injectable()
export class ProductService {
  private readonly indexName = 'products';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexProduct(name: string, description: string) {
    await this.elasticsearchService.index({
      index: this.indexName,
      id: randomUUID(),
      body: {
        name,
        description,
      },
    });
  }

  async searchProducts(query: string) {
    const { hits } = await this.elasticsearchService.search({
      index: this.indexName,
      body: {
        query: {
          // match: {
          //   query,
          // },
          multi_match: {
            query,
            fields: ['name', 'description'],
          },
        },
      },
    });

    return hits.hits.map((hit: any) => hit._source);
  }

  async getAllProducts() {
    const { hits } = await this.elasticsearchService.search({
      index: this.indexName,
      query: {
        match_all: {},
      },
    });

    return hits.hits;
  }
}
