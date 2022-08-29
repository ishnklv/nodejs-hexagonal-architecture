import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateManyDto, CrudRequest } from '@nestjsx/crud';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Uuid } from '@libs/libs/base';
import { UserOrmEntity } from '@modules/user/repository/user.orm-entity';
import { UserCreatedDomainEvent } from '@modules/user/domain/events/user-created.domain-event';
import { UserDeletedDomainEvent } from '@modules/user/domain/events/user-deleted.domain-event';

@Injectable()
export class CrudUserService extends TypeOrmCrudService<UserOrmEntity> {

  private readonly logger = new Logger(CrudUserService.name);

  constructor(@InjectRepository(UserOrmEntity) readonly repo: Repository<UserOrmEntity>,
              private readonly eventService: EventEmitter2) {
    super(repo);
  }

  async createOne(req: CrudRequest, dto: DeepPartial<UserOrmEntity>): Promise<UserOrmEntity> {
    const user = await super.createOne(req, dto);
    this.logger.debug(`[Entity persisted]: ${this.repo.metadata.tableName} ${user.id}`);
    user && this.eventService.emit(
      UserCreatedDomainEvent.eventName,
      new UserCreatedDomainEvent({ aggregateId: new Uuid(user.id) }),
    );
    return user;
  }

  async createMany(req: CrudRequest, dto: CreateManyDto<DeepPartial<UserOrmEntity>>): Promise<UserOrmEntity[]> {
    const users = await super.createMany(req, dto);
    this.logger.debug(`[Multiple entities persisted]: ${this.repo.metadata.tableName}`);
    await Promise.all(
      users?.map(
        user => this.eventService.emit(
          UserCreatedDomainEvent.eventName,
          new UserCreatedDomainEvent({ aggregateId: new Uuid(user.id) }),
        ),
      ),
    );
    return users;
  }

  async deleteOne(req: CrudRequest): Promise<void | UserOrmEntity> {
    const user = await super.deleteOne(req);
    const userId = req.parsed.paramsFilter[0].value;
    this.logger.debug(`[Entity deleted]: ${this.repo.metadata.tableName} ${userId}`);
    this.eventService.emit(
      UserDeletedDomainEvent.eventName,
      new UserDeletedDomainEvent({ aggregateId: new Uuid(userId) }),
    );
    return user;
  }

}
