import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const ORM_CONFIG: OrmConfig = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: false,
  logging: true,
  migrations: ['db/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  entities: ['src/**/**/*.entity.ts'],
  ssl: null,
};

if (process.env.ENV === 'production') {
  ORM_CONFIG['ssl'] = <any>{
    ca: process.env.DB_CA,
    rejectUnauthorized: false,
  };
}

export const AppDataSource: DataSource = new DataSource(
  <DataSourceOptions>ORM_CONFIG,
);

interface OrmConfig {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  migrations: string[];
  migrationsTableName: string;
  entities: string[];
  ssl: any;
}
