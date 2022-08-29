import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, ObjectType } from 'typeorm';
import { Logger } from '@nestjs/common';
import { BaseOrmEntity } from '../base.orm-entity';
import { NonFunctionProperties } from '../../../types/non-function-properties.type';

/**
 * The BaseSeeder seeds the database with mocked data.
 */
export abstract class BaseSeeder<OrmEntity extends BaseOrmEntity> implements Seeder {

  private readonly logger = new Logger(this.constructor.name);

  protected constructor(
    readonly seeds: NonFunctionProperties<OrmEntity>[],
    readonly type: ObjectType<unknown>,
  ) {
  }

  /**
   * Executes the seeding.
   *
   * It inserts the seeds into the table. It does not drop the table
   * beforehand, i.e. duplicate key constraints may occur.
   *
   * @param factory creates the seeds passed to the constructor
   * @param connection
   */
  async run(factory: Factory, connection: Connection): Promise<void> {
    if (!this.seeds) {
      this.logger.warn(`No seeds provided for ${this.constructor.name} (${this.type?.name})`);
      return;
    }
    if (!this.type) {
      this.logger.warn(`No type provided for ${this.constructor.name}`);
      return;
    }

    await connection.createQueryBuilder()
      .insert()
      .into(connection.getMetadata(this.type).tableName)
      .values(this.seeds)
      .execute();
  }

}
