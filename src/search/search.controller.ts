import { Controller, Get, Query } from '@nestjs/common';
import { Product } from 'src/product/entities/product.entity';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/search')
  async searchProducts(@Query('query') query: string): Promise<Product[]> {
    return this.searchService.searchProducts(query);
  }
}
