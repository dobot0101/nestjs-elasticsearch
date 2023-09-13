import { Module } from 'node_modules/@nestjs/common';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ProductModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
