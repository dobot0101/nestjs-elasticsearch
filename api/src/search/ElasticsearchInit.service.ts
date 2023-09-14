import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { readFile } from 'fs/promises';

@Injectable()
export class ElasticsearchInitService implements OnModuleInit {
  private readonly index = 'products';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
  async onModuleInit() {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: this.index,
    });

    console.log({ indexExists });

    if (!indexExists) {
      await this.createIndex();
    }

    const documentSearchResult = await this.elasticsearchService.search({
      index: this.index,
    });

    console.log(documentSearchResult);

    if (documentSearchResult.hits.hits.length === 0) {
      await this.createDocuments();
    }
  }

  private async createDocuments() {
    try {
      const contents = await readFile('./src/products.json', 'utf-8');
      if (contents) {
        const products: Product[] = JSON.parse(contents);

        while (products.length > 0) {
          const productsChunk = products.splice(0, 10);
          await Promise.all(
            productsChunk.map(async (product) => {
              await this.elasticsearchService.index({
                index: this.index,
                id: product.id,
                body: {
                  title: product.title,
                  modifier: product.modifier,
                  search_keyword: product.search_keyword,
                },
              });
            }),
          );
        }
      }
    } catch (error) {
      console.error('상품 정보 문서 생성 중 에러: ', error);
    }
  }

  private async createIndex() {
    try {
      const res = await this.elasticsearchService.indices.create({
        index: this.index,
        body: {
          settings: {
            analysis: {
              tokenizer: {
                nori_tokenizer: {
                  type: 'nori_tokenizer',
                  decompound_mode: 'mixed',
                  discard_punctuation: false,
                  // "user_dictionary": "userdict_ko.txt"
                },
              },
              analyzer: {
                nori_analyzer: {
                  type: 'custom',
                  tokenizer: 'nori_tokenizer',
                },
              },
            },
          },
          mappings: {
            properties: {
              title: {
                type: 'text',
                analyzer: 'nori_analyzer',
              },
              modifier: {
                type: 'text',
                analyzer: 'nori_analyzer',
              },
              search_keyword: {
                type: 'text',
                analyzer: 'nori_analyzer',
              },
            },
          },
        },
      });
      console.log('Index create result:', res);
    } catch (error) {
      console.error('Error creating index:', error);
    }
  }
}

type Product = {
  id: string;
  title: string;
  modifier: string;
  search_keyword: string;
};
