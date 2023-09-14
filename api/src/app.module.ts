import { ConfigModule } from '@nestjs/config';
import { Module } from 'node_modules/@nestjs/common';
import { SearchModule } from './search/search.module';
@Module({
  imports: [ConfigModule.forRoot(), SearchModule],
})
export class AppModule {}
