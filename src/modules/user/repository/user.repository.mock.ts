import { UserEntity, UserProps } from '../domain/entities/user.entity';
import { BaseRepositoryMock } from '@libs/libs/base';
import { UserRepositoryInterface } from '@modules/user/repository/user.repository.interface';

export class UserRepositoryMock extends BaseRepositoryMock<UserEntity, UserProps> implements UserRepositoryInterface {

}
