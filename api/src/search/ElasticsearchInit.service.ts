import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { readFile } from 'fs/promises';

@Injectable()
export class ElasticsearchInitService implements OnModuleInit {
  private readonly index = 'products';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
  async onModuleInit() {
    const maxRetryCount = 10;
    let retryCount = 0;
    while (retryCount < maxRetryCount) {
      try {
        const indexExists = await this.checkIndexExists();
        console.log({ indexExists });
        if (!indexExists) {
          await this.createIndex();
        }

        const documentExists = await this.checkDocumentExists();
        console.log({ documentExists });
        if (!documentExists) {
          await this.createDocuments();
        }

        return;
      } catch (error) {
        console.error('Elasticsearch가 아직 준비되지 않음. 재시도 중...');
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }

    throw new Error(
      `5번 재시도 하였으나. Elasticsearch가 준비되지 않아 프로그램 종료...`,
    );
  }

  private async checkIndexExists() {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: this.index,
    });
    return indexExists;
  }

  private async checkDocumentExists() {
    const res = await this.elasticsearchService.search({
      index: this.index,
    });
    return res.hits.hits.length > 0;
  }

  private async createDocuments() {
    try {
      const contents = await readFile('./src/products.json', 'utf-8');
      if (contents) {
        const products: Product[] = JSON.parse(contents);

        while (products.length > 0) {
          const productsChunk = products.splice(0, 10);
          const results = await Promise.all(
            productsChunk.map(async (product) => {
              await this.elasticsearchService.index({
                index: this.index,
                body: {
                  productId: product.id,
                  analyzed_title: product.title,
                  analyzed_modifier: product.modifier,
                  analyzed_search_keyword: product.search_keyword,
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
            max_ngram_diff: 3,
            analysis: {
              tokenizer: {
                nori_tokenizer: {
                  type: 'nori_tokenizer',
                  decompound_mode: 'mixed',
                  discard_punctuation: false,
                  // "user_dictionary": "userdict_ko.txt"
                },
                ngram_tokenizer: {
                  min_gram: 2,
                  max_gram: 5,
                  type: 'ngram',
                  token_chars: ['letter', 'digit'],
                },
              },
              analyzer: {
                nori_analyzer: {
                  type: 'custom',
                  tokenizer: 'nori_tokenizer',
                },
                ngram_analyzer: {
                  type: 'custom',
                  tokenizer: 'ngram_tokenizer',
                },
              },
            },
          },
          mappings: {
            properties: {
              analyzed_title: {
                type: 'text',
                analyzer: 'nori_analyzer',
              },
              analyzed_modifier: {
                type: 'text',
                analyzer: 'nori_analyzer',
              },
              analyzed_search_keyword: {
                type: 'text',
                analyzer: 'nori_analyzer',
              },
              title: {
                type: 'text',
                fields: {
                  ngram: {
                    type: 'text',
                    analyzer: 'ngram_analyzer',
                  },
                },
              },
              modifier: {
                type: 'text',
                fields: {
                  ngram: {
                    type: 'text',
                    analyzer: 'ngram_analyzer',
                  },
                },
              },
              search_keyword: {
                type: 'text',
                fields: {
                  ngram: {
                    type: 'text',
                    analyzer: 'ngram_analyzer',
                  },
                },
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
  analyzed_title: string;
  analyzed_modifier: string;
  analyzed_search_keyword: string;
  title: string;
  modifier: string;
  search_keyword: string;
};
