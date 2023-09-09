import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [SearchModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
