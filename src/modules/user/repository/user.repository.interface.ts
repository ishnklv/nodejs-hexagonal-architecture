import { BaseRepositoryInterface } from '@libs/libs/base';
import { UserEntity, UserProps } from '../domain/entities/user.entity';

export abstract class UserRepositoryInterface extends BaseRepositoryInterface<UserEntity, UserProps> {

}
