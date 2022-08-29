import { Connection } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { loadFixtures } from './fixtures.utils';
import { AppModule } from '../../src/app.module';

export const initApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  const connection = app.get(Connection);
  await loadFixtures(connection);

  return app;
};

export const tearDown = async (app: INestApplication): Promise<void> => {
  const connection = app.get(Connection);
  await connection.dropDatabase();

  await app.close();
};

