import { UserEntity, UserProps } from '../domain/entities/user.entity';
import * as clone from 'clone';
import { FindConditions } from 'typeorm';
import { DateValueObject } from '@libs/libs/base';
import { UserOrmEntity } from '@modules/user/repository/user.orm-entity';
import { UserRepository } from '@modules/user/repository/user.repository';
import { Uuid } from '@libs/libs/base/modules/domain/value-object/uuid.value-object';
import { TestUtils } from '@libs/utils/test.utils';

const defaultUsers = [Uuid.generate(), Uuid.generate(), Uuid.generate()].map(uuid =>
  new UserEntity({
    id: uuid,
    props: {
      name: `Test User ${uuid.value}`,
      email: `test${uuid.value}@email.com`,
    },
  }),
);

const defaultMockUserOrmEntities = defaultUsers.map(user => new UserOrmEntity({
  id: user.id.value,
  createdAt: user.createdAt.value,
  updatedAt: user.updatedAt.value,
  name: user.name,
  email: user.email,
}));

describe(UserRepository.name, () => {

  let users: UserEntity[];
  let mockUserOrmEntities: UserOrmEntity[];

  beforeEach(() => {
    users = clone(defaultUsers);
    mockUserOrmEntities = clone(defaultMockUserOrmEntities);
  });

  TestUtils.testRepo(UserRepository, UserOrmEntity, defaultUsers, defaultMockUserOrmEntities);

  it('should prepare query correctly', async () => {
    const id = Uuid.generate();
    const now = new DateValueObject(new Date());

    const query = (await TestUtils.testPrepareQuery<UserRepository, UserOrmEntity, UserEntity, UserProps>(
      UserRepository,
      UserOrmEntity,
      {
        id,
        name: null,
        email: undefined,
        createdAt: now,
      })) as FindConditions<UserOrmEntity>;


    expect(query.id).toEqual(id.value);
    expect(query.createdAt).toEqual(now);
    expect(query.name).toBeNull();
    expect(query).not.toHaveProperty('email');
    expect(query).not.toHaveProperty('updatedAt');
  });

});
