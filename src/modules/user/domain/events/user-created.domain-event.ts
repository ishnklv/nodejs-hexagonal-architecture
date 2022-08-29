import { BaseDomainEvent } from '@libs/libs/base';

export class UserCreatedDomainEvent extends BaseDomainEvent {

  static eventName = UserCreatedDomainEvent.name;

}
