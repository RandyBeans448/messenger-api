import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getCorsArray } from './bootstrap/cors.bootstrap';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './@utils/logger/logger.config';
import { INestApplication, Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
    const app: INestApplication<any> = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(loggerConfig('info')),
        bodyParser: true,
    });

    const configService: ConfigService = app.get(ConfigService);

    app.enableCors({ origin: getCorsArray(configService.get('CORS_WHITELIST')) });

    await app.listen(3000);

    logger.log(`CORS: ${configService.get('CORS_WHITELIST')}`);
    logger.log(`Application listening on port ${3000}`);
}
bootstrap();
