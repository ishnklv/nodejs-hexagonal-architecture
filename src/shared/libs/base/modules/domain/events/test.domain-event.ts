import { BaseDomainEvent } from '@libs/libs/base';

/**
 * TestDomainEvent is a domain event for testing purposes.
 */
export class TestDomainEvent extends BaseDomainEvent {

  static eventName = TestDomainEvent.name;

}
