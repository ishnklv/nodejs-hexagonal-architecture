import {
  BaseOrmEntityProps,
  BaseRepositoryInterface,
  DataWithPaginationMeta,
  PaginatedParams,
  QueryParams,
} from './base.repository.interface';
import { BaseAggregate } from '@libs/libs/base';

interface MockValues<Entity extends BaseOrmEntityProps> {
  findMany?: Entity[],
  findManyPaginated?: DataWithPaginationMeta<Entity[]>;
  findOne?: Entity,
  findOneOrThrow?: Entity,
  saveMany?: Entity[];
  saveOne?: Entity;
  deleteOne?: Entity;
}

/**
 * The BaseRepositoryMock mocks a database for unit tests.
 *
 * The constructor receives the values that it should return in the respective
 * function.
 */
export class BaseRepositoryMock<Entity extends BaseAggregate<unknown>, EntityProps>
  implements BaseRepositoryInterface<Entity, EntityProps> {

  constructor(readonly mockValues: MockValues<Entity>) {
  }

  async findMany(params: QueryParams<EntityProps>): Promise<Entity[]> {
    return this.mockValues.findMany;
  }

  async findManyPaginated(params: PaginatedParams<EntityProps>): Promise<DataWithPaginationMeta<Entity[]>> {
    return this.mockValues.findManyPaginated;
  }

  async findOne(params: QueryParams<EntityProps>): Promise<Entity> {
    return this.mockValues.findOne;
  }

  async findOneOrThrow(params: QueryParams<EntityProps>): Promise<Entity> {
    return this.mockValues.findOneOrThrow;
  }

  async saveMany(entities: Entity[]): Promise<Entity[]> {
    return this.mockValues.saveMany;
  }

  async saveOne(entity: Entity): Promise<Entity> {
    return this.mockValues.saveOne;
  }

  async deleteOne(entity: Entity): Promise<Entity> {
    return this.mockValues.deleteOne;
  }

  setCorrelationId(correlationId: string): this {
    return this;
  }

}
