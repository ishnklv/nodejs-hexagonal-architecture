import { dateMock } from '@libs/libs/base';
import { UserOrmMapper } from '@modules/user/repository/user.orm-mapper';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserOrmEntity } from '@modules/user/repository/user.orm-entity';
import { Uuid } from '@libs/libs/base/modules/domain/value-object/uuid.value-object';

describe(UserOrmMapper.name, () => {

  let ormMapper: UserOrmMapper;

  beforeEach(() => {
    ormMapper = new UserOrmMapper(UserEntity, UserOrmEntity);
  });

  it('should map from domain to orm entity', () => {
    const entity = new UserEntity({
      id: Uuid.generate(),
      props: {
        name: 'Test',
        email: 'test@test.com',
      }
    });

    const ormEntity = ormMapper.toOrmEntity(entity);

    expect(ormEntity.id).toEqual(entity.id.value);
    expect(ormEntity.createdAt).toEqual(entity.createdAt.value);
    expect(ormEntity.updatedAt).toEqual(entity.updatedAt.value);
    expect(ormEntity.name).toEqual(entity.name);
    expect(ormEntity.email).toEqual(entity.email);
  });

  it('should map from orm to domain entity', () => {
    const ormEntity = new UserOrmEntity({
      id: Uuid.generate().value,
      createdAt: dateMock,
      updatedAt: dateMock,
      name: 'TestORM',
      email: 'test@orm.com',
    });

    const entity = ormMapper.toDomainEntity(ormEntity);

    expect(entity.id.value).toEqual(ormEntity.id);
    expect(entity.createdAt.value).toEqual(ormEntity.createdAt);
    expect(entity.updatedAt.value).toEqual(ormEntity.updatedAt);
    expect(entity.name).toEqual(ormEntity.name);
    expect(entity.email).toEqual(ormEntity.email);
  });

});
