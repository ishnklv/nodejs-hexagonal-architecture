import { ormConfig } from './orm.config';
import { ConfigModuleOptions } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const configOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: [
    `.env.${process.env.NODE_ENV}`,
  ],
  load: [
    (): TypeOrmModuleOptions => ormConfig,
  ],
};
