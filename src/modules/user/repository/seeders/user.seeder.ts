import { userSeeds } from './user.seeds';
import { BaseSeeder } from '@libs/libs/base';
import { UserOrmEntity } from '@modules/user/repository/user.orm-entity';

export class UserSeeder extends BaseSeeder<UserOrmEntity> {

  constructor() {
    super(userSeeds, UserOrmEntity);
  }
}
