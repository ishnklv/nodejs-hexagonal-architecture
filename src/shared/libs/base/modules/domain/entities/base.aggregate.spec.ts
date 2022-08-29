import { TestAggregate } from './test.aggregate';
import { TestDomainEvent } from '../events/test.domain-event';
import { BaseAggregate, Uuid } from '@libs/libs/base';

describe(BaseAggregate.name, () => {

  let aggregate: BaseAggregate<unknown>;

  beforeEach(() => {
    aggregate = new TestAggregate({ id: Uuid.generate(), props: { prop1: 'test.prop' } });
  });

  it('should add event', () => {
    expect(aggregate.domainEvents).toHaveLength(0);
    aggregate.addEvent(new TestDomainEvent({ aggregateId: Uuid.generate() }));
    expect(aggregate.domainEvents).toHaveLength(1);
  });

  it('should clear events', () => {
    aggregate.addEvent(new TestDomainEvent({ aggregateId: Uuid.generate() }));
    expect(aggregate.domainEvents).toHaveLength(1);
    aggregate.clearEvents();
    expect(aggregate.domainEvents).toHaveLength(0);
  });

});
