import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchInitService } from 'src/search/ElasticsearchInit.service';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

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
  providers: [ElasticsearchInitService, SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
