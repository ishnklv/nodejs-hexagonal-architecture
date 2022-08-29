import { Injectable } from '@nestjs/common';
import { DomainEventService, TypeormUnitOfWork } from '@libs/libs/base';
import { UserRepository } from '@modules/user/repository/user.repository';
import { UserOrmEntity } from '@modules/user/repository/user.orm-entity';

@Injectable()
export class UnitOfWork extends TypeormUnitOfWork {

  constructor(private readonly eventService: DomainEventService) {
    super();
  }

  getUserRepository(correlationId: string): UserRepository {
    return new UserRepository(
      this.getOrmRepository(UserOrmEntity, correlationId),
      this.eventService
    ).setCorrelationId(correlationId);
  }

  // Add more repositories here
}
