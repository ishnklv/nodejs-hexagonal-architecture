import { BaseDomainEvent } from '@libs/libs/base';

export class UserDeletedDomainEvent extends BaseDomainEvent {

  static eventName = UserDeletedDomainEvent.name;

}
