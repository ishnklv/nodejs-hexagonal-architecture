import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, Type } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';
import * as clone from 'clone';
import {
  BaseAggregate,
  BaseOrmEntity,
  BaseOrmEntityProps,
  DomainEventService,
  PaginationMeta,
  QueryParams,
  WhereCondition,
} from '@libs/libs/base';
import { TypeormBaseRepository } from '@libs/libs/base/modules/repository/typeorm.base.repository';
import { Uuid } from '@libs/libs/base/modules/domain/value-object/uuid.value-object';

type RepoMockValues<OrmEntity> = {
  findOneMockValue?: OrmEntity,
  findMockValue?: OrmEntity[],
  findAndCountMockValue?: [OrmEntity[], number],
  saveMockValue?: OrmEntity | OrmEntity[],
  removeMockValue?: OrmEntity,
}

export class TestUtils {

  /**
   * Regex pattern for uuid v4.
   */
  static uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  /**
   * Basic tests for a repository.
   *
   * @param repoType
   * @param ormEntityType
   * @param entities
   * @param mockOrmEntities
   */
  static async testRepo<Repo extends TypeormBaseRepository<Entity, BaseOrmEntityProps, OrmEntity>,
    OrmEntity extends BaseOrmEntity,
    Entity extends BaseAggregate<unknown>>(
    repoType: Type<Repo>,
    ormEntityType: EntityClassOrSchema,
    entities: Entity[],
    mockOrmEntities: OrmEntity[],
  ): Promise<void> {

    describe('Basic Tests', () => {

      let testEntities: Entity[];
      let testMockOrmEntities: OrmEntity[];

      beforeEach(() => {
        // Clone the objects to prevent modifying the original parameters
        testEntities = clone(entities);
        testMockOrmEntities = clone(mockOrmEntities);
        // Remove domain events to not fail the deep equal check
        testEntities.forEach(entity => TestUtils.removeDomainEvents(entity));
      });

      it('should be defined', async () => {
        const { repo } = await TestUtils.createRepoWithTypeormRepoMock(repoType, ormEntityType);
        expect(repo).toBeDefined();
      });

      it('should save and return one entity', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { saveMockValue: testMockOrmEntities[0] },
        );

        const savedEntity = await repo.saveOne(testEntities[0]);

        expect(savedEntity).toEqual(testEntities[0]);
        expect(typeOrmRepo.save).toBeCalledTimes(1);
      });

      it('should save many and return all entities', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { saveMockValue: testMockOrmEntities },
        );

        const savedEntities = await repo.saveMany(testEntities);
        const savedEntitiesWithoutDomainEvents = savedEntities.map(savedEntity => TestUtils.removeDomainEvents(savedEntity));

        expect(savedEntitiesWithoutDomainEvents).toEqual(testEntities);
        expect(typeOrmRepo.save).toBeCalledTimes(1);
      });

      it('should find one entity by id', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { findOneMockValue: testMockOrmEntities[0] },
        );

        const foundEntity = await repo.findOne({
          id: testEntities[0].id,
        });

        expect(foundEntity).toEqual(testEntities[0]);
        expect(typeOrmRepo.findOne).toBeCalledTimes(1);
      });

      it('should have empty params by default', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { findOneMockValue: null },
        );

        const foundEntity = await repo.findOne();

        expect(foundEntity).toBeUndefined();
        expect(typeOrmRepo.findOne).toBeCalledTimes(1);
      });

      it('should throw an exception', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { findOneMockValue: null },
        );

        const findOneOrThrow = async () => await repo.findOneOrThrow({
          id: Uuid.generate(),
        });

        await expect(findOneOrThrow()).rejects.toThrow(NotFoundException);
        expect(typeOrmRepo.findOne).toBeCalledTimes(1);
      });

      it('should have empty params by default', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { findOneMockValue: null },
        );

        const findOneOrThrow = async () => await repo.findOneOrThrow();

        await expect(findOneOrThrow()).rejects.toThrow(NotFoundException);
        expect(typeOrmRepo.findOne).toBeCalledTimes(1);
      });

      it('should not throw if found', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { findOneMockValue: testMockOrmEntities[0] },
        );

        const foundEntity = await repo.findOneOrThrow({
          id: testEntities[0].id,
        });

        expect(foundEntity).toEqual(testEntities[0]);
        expect(typeOrmRepo.findOne).toBeCalledTimes(1);
      });

      it('should find many entities', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { findMockValue: testMockOrmEntities },
        );

        const foundEntities = await repo.findMany();

        expect(foundEntities).toHaveLength(testMockOrmEntities.length);
        expect(foundEntities).toEqual(testEntities);
        expect(typeOrmRepo.find).toBeCalledTimes(1);
      });

      it('should return with pagination metadata', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { findAndCountMockValue: [testMockOrmEntities, testMockOrmEntities.length] },
        );
        const pagination: PaginationMeta = {
          skip: 0,
          limit: 50,
          page: 0,
        };

        const entitiesWithPaginationMetadata = await repo.findManyPaginated({
          pagination,
        });
        const entitiesWithoutDomainEvents = entitiesWithPaginationMetadata.data.map(savedEntity => TestUtils.removeDomainEvents(savedEntity));


        expect(entitiesWithoutDomainEvents).toEqual(testEntities);
        expect(entitiesWithPaginationMetadata.count).toEqual(testMockOrmEntities.length);
        expect(entitiesWithPaginationMetadata.limit).toEqual(50);
        expect(entitiesWithPaginationMetadata.page).toEqual(0);
        expect(typeOrmRepo.findAndCount).toBeCalledTimes(1);
      });

      it('should return with undefined pagination metadata', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { findAndCountMockValue: [testMockOrmEntities, testMockOrmEntities.length] },
        );
        const entitiesWithPaginationMetadata = await repo.findManyPaginated({});
        const entitiesWithoutDomainEvents = entitiesWithPaginationMetadata.data.map(savedEntity => TestUtils.removeDomainEvents(savedEntity));

        expect(entitiesWithoutDomainEvents).toEqual(testEntities);
        expect(entitiesWithPaginationMetadata.count).toEqual(testMockOrmEntities.length);
        expect(entitiesWithPaginationMetadata.limit).toEqual(undefined);
        expect(entitiesWithPaginationMetadata.page).toEqual(undefined);
        expect(typeOrmRepo.findAndCount).toBeCalledTimes(1);
      });

      it('should delete one entity', async () => {
        const { repo, typeOrmRepo } = await TestUtils.createRepoWithTypeormRepoMock(
          repoType,
          ormEntityType,
          { removeMockValue: testMockOrmEntities[0] },
        );

        const deletedEntity = await repo.deleteOne(testEntities[0]);

        expect(deletedEntity).toEqual(testEntities[0]);
        expect(typeOrmRepo.remove).toBeCalledTimes(1);
      });

    });

  }

  /**
   * Creates a module for testing with a repository and a typeorm repository as
   * provider.
   *
   * @param repoType
   * @param ormEntityType
   * @param findOneMockValue
   * @param findMockValue
   * @param findAndCountMockValue
   * @param saveMockValue
   * @param removeMockValue
   */
  static async createRepoWithTypeormRepoMock<Repo extends TypeormBaseRepository<Entity, BaseOrmEntityProps, OrmEntity>,
    OrmEntity extends BaseOrmEntity,
    Entity extends BaseAggregate<unknown>>(
    repoType: Type<Repo>,
    ormEntityType: EntityClassOrSchema,
    {
      findOneMockValue,
      findMockValue,
      findAndCountMockValue,
      saveMockValue,
      removeMockValue,
    }: RepoMockValues<OrmEntity> = {},
  ): Promise<{
    app: TestingModule;
    mockFns: { findAndCount: jest.Mock; find: jest.Mock; findOne: jest.Mock; save: jest.Mock; remove: jest.Mock };
    repo: Repo;
    typeOrmRepo: Repository<OrmEntity>
  }> {

    const mockFns = {
      findOne: jest.fn().mockResolvedValue(findOneMockValue),
      find: jest.fn().mockResolvedValue(findMockValue),
      findAndCount: jest.fn().mockResolvedValue(findAndCountMockValue),
      save: jest.fn().mockResolvedValue(saveMockValue),
      remove: jest.fn().mockResolvedValue(removeMockValue),
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        repoType,
        {
          provide: getRepositoryToken(ormEntityType),
          useValue: {
            ...mockFns,
            metadata: {
              tableName: ormEntityType,
            },
          },
        },
        {
          provide: DomainEventService,
          useValue: {
            publishEvents: jest.fn(),
          },
        },
      ],
    }).compile();

    return {
      app: app,
      repo: app.get(repoType),
      typeOrmRepo: app.get(getRepositoryToken(ormEntityType)),
      mockFns,
    };
  }

  static async testPrepareQuery<Repo extends TypeormBaseRepository<Entity, Props, OrmEntity>,
    OrmEntity extends BaseOrmEntity,
    Entity extends BaseAggregate<unknown>,
    Props>(
    repoType: Type<Repo>,
    ormEntityType: EntityClassOrSchema,
    params: QueryParams<Props>,
  ): Promise<WhereCondition<OrmEntity>> {

    const { repo } = await TestUtils.createRepoWithTypeormRepoMock(repoType, ormEntityType);

    // Spy on protected method prepareQuery.
    // See https://stackoverflow.com/questions/56044471/testing-private-functions-in-typescript-with-jest
    const prepareQuerySpy = jest.spyOn(repoType.prototype as any, 'prepareQuery');

    // Call findOne which calls prepareQuery
    await repo.findOne(params);

    return prepareQuerySpy.mock.results[0].value as WhereCondition<OrmEntity>;
  }

  static removeDomainEvents<T>(entity: T): T {
    (entity as unknown as BaseAggregate<unknown>)['_domainEvents'] = []
    return entity;
  }

}
