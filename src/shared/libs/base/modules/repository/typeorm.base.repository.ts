import { Repository } from 'typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import {
  BaseOrmEntityProps,
  BaseRepositoryInterface,
  DataWithPaginationMeta,
  PaginatedParams,
  QueryParams,
  WhereCondition,
} from '@libs/libs/base/modules/repository/base.repository.interface';
import { BaseAggregate, BaseOrmMapper, DomainEventService } from '@libs/libs/base';

/**
 * The TypeormBaseRepository is the base implementation for the
 * repository interface.
 */
export abstract class TypeormBaseRepository<Entity extends BaseAggregate<unknown>,
  EntityProps,
  OrmEntity> implements BaseRepositoryInterface<Entity, EntityProps> {

  protected readonly logger = new Logger(this.constructor.name);

  /**
   * Indicates what relations of entity should be loaded (simplified left join form).
   * See typeorm docs.
   * @protected
   */
  protected abstract relations: string[];

  /**
   * Entity table name in the database.
   * This is final table name of the entity.
   * This name already passed naming strategy, and generated based on
   * multiple criteria, including user table name and global table prefix.
   * @protected
   */
  protected tableName = this.repository.metadata.tableName;

  /**
   * Correlation id for a unit of work.
   * @protected
   */
  protected correlationId?: string;

  protected constructor(
    protected readonly repository: Repository<OrmEntity>,
    protected readonly mapper: BaseOrmMapper<Entity, OrmEntity>,
    protected readonly eventService: DomainEventService,
  ) {
  }

  async saveOne(entity: Entity): Promise<Entity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    const result = await this.repository.save(ormEntity);
    this.logger.debug(`[Entity persisted]: ${this.tableName} ${entity.id.value}`);
    await this.eventService.publishEvents(entity.id);
    return this.mapper.toDomainEntity(result);
  }

  async saveMany(entities: Entity[]): Promise<Entity[]> {
    const ormEntities = entities.map(entity => this.mapper.toOrmEntity(entity));
    const result = await this.repository.save(ormEntities);
    this.logger.debug(`[Multiple entities persisted]: ${entities.length} ${this.tableName}`);
    await Promise.all(
      entities.map(async entity =>
        await this.eventService.publishEvents(entity.id),
      ),
    );
    return result.map(entity => this.mapper.toDomainEntity(entity));
  }

  async findOne(params: QueryParams<EntityProps> = {}): Promise<Entity | undefined> {
    const found = await this.repository.findOne({
      where: this.preparePropsQuery(params),
      relations: this.relations,
    });
    return found ? this.mapper.toDomainEntity(found) : undefined;
  }

  async findOneOrThrow(params: QueryParams<EntityProps> = {}): Promise<Entity> {
    const found = await this.findOne(params);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async findMany(params: QueryParams<EntityProps> = {}): Promise<Entity[]> {
    const result = await this.repository.find({
      where: this.preparePropsQuery(params),
      relations: this.relations,
    });

    return result.map(item => this.mapper.toDomainEntity(item));
  }

  async findManyPaginated({
                            params = {},
                            pagination,
                            orderBy,
                          }: PaginatedParams<EntityProps>): Promise<DataWithPaginationMeta<Entity[]>> {
    const [data, count] = await this.repository.findAndCount({
      skip: pagination?.skip,
      take: pagination?.limit,
      where: this.preparePropsQuery(params),
      order: orderBy,
      relations: this.relations,
    });

    return {
      data: data.map(item => this.mapper.toDomainEntity(item)),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };
  }

  async deleteOne(entity: Entity): Promise<Entity> {
    await this.repository.remove(this.mapper.toOrmEntity(entity));
    this.logger.debug(`[Entity deleted]: ${this.tableName} ${entity.id.value}`);
    return entity;
  }

  setCorrelationId(correlationId: string): this {
    this.correlationId = correlationId;
    return this;
  }

  /**
   * Constructs a query for the props of a specific orm entity.
   *
   * The props of the base orm entity are already added to the query as
   * object (FindConditions<OrmEntity>).
   *
   * All properties in the query are matched when querying the database,
   * i.e. if a query property is null or undefined, it will be matched to a
   * null value in the db.
   *
   * Therefore, the query has to be prepared in such a way that QueryParams
   * that are undefined are not added to the WhereCondition, but null values
   * are added. This way, null values in the db can be queried.
   * @param params
   * @param query
   * @protected
   */
  protected abstract prepareQuery(
    params: QueryParams<EntityProps>,
    query: WhereCondition<OrmEntity & BaseOrmEntityProps>,
  ): WhereCondition<OrmEntity>;

  /**
   * Constructs a query for the base orm entity props and the props of a
   * specific orm entity type.
   *
   * All properties in the query are matched when querying the database,
   * i.e. if a query property is null or undefined, it will be matched to a
   * null value in the db.
   *
   * Therefore, the query has to be prepared in such a way that QueryParams
   * that are undefined are not added to the WhereCondition, but null values
   * are added. This way, null values in the db can be queried.
   * @param params
   * @protected
   */
  private preparePropsQuery(params: QueryParams<EntityProps>): WhereCondition<OrmEntity> {
    const query: WhereCondition<OrmEntity & BaseOrmEntityProps> = {};
    if (params.id !== undefined) query.id = params.id.value;
    if (params.createdAt !== undefined) query.createdAt = params.createdAt;
    if (params.updatedAt !== undefined) query.updatedAt = params.updatedAt;
    return this.prepareQuery(params, query);
  };

}
