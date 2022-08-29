import { Test } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createMock } from '@golevelup/ts-jest';
import { DomainEventService, Uuid } from '@libs/libs/base';
import { TestAggregate } from '@libs/libs/base/modules/domain/entities/test.aggregate';
import { TestDomainEvent } from '@libs/libs/base/modules/domain/events/test.domain-event';

describe(DomainEventService.name, () => {

  let service: DomainEventService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    eventEmitter = createMock<EventEmitter2>();
    const module = await Test.createTestingModule({
      providers: [
        DomainEventService,
        {
          provide: EventEmitter2,
          useValue: eventEmitter,
        },
      ],
    }).compile();

    service = module.get(DomainEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not publish event when no aggregate is found', async () => {
    const aggregate = new TestAggregate({ id: Uuid.generate(), props: { prop1: 'test.prop' } });

    await service.publishEvents(aggregate.id);

    expect(eventEmitter.emit).toBeCalledTimes(0);
  });


  it('should publish event', async () => {
    const aggregate = new TestAggregate({ id: Uuid.generate(), props: { prop1: 'test.prop' } });
    const event = new TestDomainEvent({ aggregateId: aggregate.id });
    aggregate.addEvent(event);
    DomainEventService.prepareForPublish(aggregate);

    await service.publishEvents(aggregate.id);

    expect(eventEmitter.emit).toBeCalledTimes(1);
    expect(eventEmitter.emit).toBeCalledWith(TestDomainEvent.name, event);
  });

});
