import { BaseDomainEvent } from '@libs/libs/base/modules/domain/events/base.domain-event';

export class AllEventsDomainEvent extends BaseDomainEvent {

  static eventName = '**';

}
