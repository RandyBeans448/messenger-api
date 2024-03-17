/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const config: any =  {
                    type: 'postgres',
                    autoLoadEntities: true,
                    migrations: ['src/migration/*{.ts,.js}'],
                    migrationsTableName: "db_migrations",
                    host: configService.get('TYPEORM_HOST'),
                    port: +configService.get('TYPEORM_PORT'),
                    username: configService.get('TYPEORM_USERNAME'),
                    password: configService.get('TYPEORM_PASSWORD'),
                    database: configService.get('TYPEORM_DATABASE'),
                    synchronize: false,
                };

              return config;
            }
          }),
    ]
})
export class DatabaseModule {}
