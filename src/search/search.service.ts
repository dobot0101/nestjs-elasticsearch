import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class SearchService {
  constructor(private esService: ElasticsearchService) {}
  async searchProducts(query: string): Promise<Product[]> {
    const { hits } = await this.esService.search<Product>({
      index: 'products',
      body: {
        query: {
          match: {
            name: query,
          },
        },
      },
    });

    return hits.hits.map((hit) => hit._source!);
  }
}
