import { IQueryHandler } from '@nestjs/cqrs';
import { Result } from '../../types/result.type';
import { BaseQuery } from '@libs/libs/base';

export abstract class BaseQueryHandlerService implements IQueryHandler {

  /**
   * For consistency with a CommandHandlerBase and DomainEventHandler
   */
  abstract handle(query: BaseQuery): Promise<Result<unknown>>;

  execute(query: BaseQuery): Promise<Result<unknown>> {
    return this.handle(query);
  }
}
