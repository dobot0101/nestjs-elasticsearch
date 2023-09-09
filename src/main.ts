import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search/search.module';

async function bootstrap() {
  const app = await NestFactory.create(SearchModule);
  const port = Number(process.env.NESTJS_APP_PORT);
  await app.listen(port, () => console.log(`${port}번 포트로 연결됨`));
}
bootstrap().catch(console.error);
