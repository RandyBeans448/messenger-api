import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getCorsArray } from './bootstrap/cors.bootstrap';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './@utils/logger/logger.config';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

const logger: Logger = new Logger('Bootstrap');

async function bootstrap() {
    const app: INestApplication<any> = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(loggerConfig('info')),
        bodyParser: true,
    });

    const configService: ConfigService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.enableCors({ origin: getCorsArray(configService.get('CORS_WHITELIST')) });

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Too many requests, please try again later.',
        })
    );

    await app.listen(3000);

    logger.log(`CORS: ${configService.get('CORS_WHITELIST')}`);
    logger.log(`Application listening on port ${3000}`);
}
bootstrap();
