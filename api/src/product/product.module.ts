import { Module } from 'node_modules/@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from 'node_modules/@nestjs/elasticsearch';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: `http://${configService.getOrThrow<string>(
          'ELASTIC_HOST',
        )}:${configService.getOrThrow<string>('ELASTIC_PORT')}`,
      }),
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
