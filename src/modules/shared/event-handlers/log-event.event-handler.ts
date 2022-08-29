import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseEventHandler } from '@libs/libs/base';
import { AllEventsDomainEvent } from '@modules/shared/domain/events/all-events.domain-event';

@Injectable()
export class LogEventEventHandler extends BaseEventHandler<AllEventsDomainEvent> {

  private readonly logger = new Logger(LogEventEventHandler.name);

  @OnEvent(AllEventsDomainEvent.eventName)
  async handleEvent(event: AllEventsDomainEvent): Promise<void> {
    this.logger.debug(`[Domain Event published]: ${event.constructor?.name} ${event.aggregateId?.value}`);
  }

}
