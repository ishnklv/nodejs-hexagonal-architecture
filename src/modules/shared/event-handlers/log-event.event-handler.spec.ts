import { createMock } from '@golevelup/ts-jest';
import { LogEventEventHandler } from '@modules/shared/event-handlers/log-event.event-handler';
import { AllEventsDomainEvent } from '@modules/shared/domain/events/all-events.domain-event';

describe(LogEventEventHandler.name, () => {

  let eventHandler: LogEventEventHandler;

  beforeEach(() => {
    eventHandler = new LogEventEventHandler();
  });

  it('should return undefined', async () => {
    const event = createMock<AllEventsDomainEvent>();
    const result = await eventHandler.handleEvent(event);

    expect(result).toBeUndefined();
  });

});
