import { Global, Logger, Module, Scope } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { eventsConfig } from '@config/events.config';
import { LogEventEventHandler } from '@modules/shared/event-handlers/log-event.event-handler';
import { DomainEventService } from '@libs/libs/base';
import { UnitOfWork } from '@modules/shared/database/unit-of-work';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot(eventsConfig),
    CqrsModule,
  ],
  providers: [
    {
      provide: Logger,
      useClass: Logger,
      scope: Scope.TRANSIENT,
    },
    LogEventEventHandler,
    DomainEventService,
    UnitOfWork,
  ],
  exports: [
    CqrsModule,
    Logger,
    LogEventEventHandler,
    DomainEventService,
    UnitOfWork,
  ],
})
export class SharedModule {
}
