import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getCorsArray } from './bootstrap/cors.bootstrap';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({ origin: getCorsArray(configService.get('CORS_WHITELIST')) });
  await app.listen(3000);
}
bootstrap();
