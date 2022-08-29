import { UserEntity, UserProps } from '../domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { DomainEventService, QueryParams, WhereCondition } from '@libs/libs/base';
import { TypeormBaseRepository } from '@libs/libs/base/modules/repository/typeorm.base.repository';
import { UserOrmEntity } from '@modules/user/repository/user.orm-entity';
import { UserRepositoryInterface } from '@modules/user/repository/user.repository.interface';
import { UserOrmMapper } from '@modules/user/repository/user.orm-mapper';

@Injectable()
export class UserRepository
  extends TypeormBaseRepository<UserEntity, UserProps, UserOrmEntity>
  implements UserRepositoryInterface {

  protected relations: string[] = [];

  constructor(@InjectRepository(UserOrmEntity) private readonly userRepository: Repository<UserOrmEntity>,
              readonly eventService: DomainEventService) {
    super(userRepository, new UserOrmMapper(UserEntity, UserOrmEntity), eventService);
  }

  protected prepareQuery(params: QueryParams<UserProps>,
                         query: FindConditions<UserOrmEntity>): WhereCondition<UserOrmEntity> {
    if (params.email !== undefined) query.email = params.email;
    if (params.name !== undefined) query.name = params.name;
    return query;
  }

}
