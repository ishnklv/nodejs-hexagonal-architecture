import { BaseSeeder } from './base.seeder';
import { BaseOrmEntity } from '../base.orm-entity';
import { Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { TestSeeder } from './test.seeder';

describe(BaseSeeder.name, () => {

  let seeder: BaseSeeder<BaseOrmEntity>;
  let factory: Factory;
  let connection: Connection;

  it('should not run if no seeds are provided', async () => {
    seeder = new TestSeeder(null, BaseOrmEntity);
    factory = jest.fn();
    connection = createMock<Connection>();
    await seeder.run(factory, connection);
    expect(connection.createQueryBuilder).toBeCalledTimes(0);
  });

  it('should log type undefined if no seeds and no type are provided', async () => {
    seeder = new TestSeeder(null, null);
    factory = jest.fn();
    connection = createMock<Connection>();
    await seeder.run(factory, connection);
    expect(connection.createQueryBuilder).toBeCalledTimes(0);
  });

  it('should not run if no type is provided', async () => {
    seeder = new TestSeeder([], null);
    factory = jest.fn();
    connection = createMock<Connection>();
    await seeder.run(factory, connection);
    expect(connection.createQueryBuilder).toBeCalledTimes(0);
  });

  it('should run if seeds are provided', async () => {
    seeder = new TestSeeder([], BaseOrmEntity);
    factory = jest.fn();
    connection = createMock<Connection>();
    await seeder.run(factory, connection);
    expect(connection.createQueryBuilder).toBeCalledTimes(1);
  });

});
