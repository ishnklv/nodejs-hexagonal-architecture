import { BaseEventHandler } from '@libs/libs/base';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedDomainEvent } from '@modules/user/domain/events/user-created.domain-event';

@Injectable()
export class UserCreatedEventHandler extends BaseEventHandler<UserCreatedDomainEvent> {

  private readonly logger = new Logger(UserCreatedDomainEvent.name);

  @OnEvent(UserCreatedDomainEvent.eventName)
  async handleEvent(event: UserCreatedDomainEvent): Promise<void> {
    this.logger.log(`User created: ${event.aggregateId.value}`);
  }

}
