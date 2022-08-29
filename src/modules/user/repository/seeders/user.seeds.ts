import { createdAtUpdatedAtMock, NonFunctionProperties } from '@libs/libs/base';
import { UserOrmEntity } from '@modules/user/repository/user.orm-entity';

export const userSeeds: NonFunctionProperties<UserOrmEntity>[] = [
  {
    ...createdAtUpdatedAtMock,
    id: '675b5c6f-52de-474f-aba6-f7717844a5e8',
    name: 'John Doe',
    email: 'john@doe.com',
  },
  {
    ...createdAtUpdatedAtMock,
    id: 'a877f456-3284-42d1-b426-4c5f44eca561',
    name: 'Jane Doe',
    email: 'jane@doe.com',
  },
];
