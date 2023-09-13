import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() body: { name: string; description: string }) {
    const { name, description } = body;
    await this.productService.indexProduct(name, description);
    return { message: 'Product created successfully' };
  }

  @Get('/search')
  async search(@Query('query') query: string) {
    return await this.productService.searchProducts(query);
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }
}
