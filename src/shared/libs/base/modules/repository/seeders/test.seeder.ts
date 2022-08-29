import { ObjectType } from 'typeorm';
import { BaseOrmEntity, BaseSeeder, NonFunctionProperties } from '@libs/libs/base';

/**
 * A seeder to test the base seeder, which is abstract.
 */
export class TestSeeder extends BaseSeeder<BaseOrmEntity> {

  constructor(seeds: NonFunctionProperties<BaseOrmEntity>[], type: ObjectType<unknown>) {
    super(seeds, type);
  }

}
