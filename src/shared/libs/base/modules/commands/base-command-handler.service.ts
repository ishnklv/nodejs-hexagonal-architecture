import { BaseCommand } from './base.command';
import { UnitOfWorkInterface } from '@libs/libs/base';
import { Result } from '../../types/result.type';
import { ICommandHandler } from '@nestjs/cqrs';

/**
 * The service implements a command.
 *
 * This cannot be annotated with @Injectable() because it is abstract.
 */
export abstract class BaseCommandHandlerService<CommandHandlerReturnType = unknown,
  CommandHandlerError extends Error = Error> implements ICommandHandler<unknown, Result<CommandHandlerReturnType, CommandHandlerError>> {

  protected constructor(protected readonly unitOfWork: UnitOfWorkInterface) {
  }

  /**
   * Handle implements the logic to handle the command .
   * @param command
   */
  abstract handle(command: BaseCommand): Promise<Result<CommandHandlerReturnType, CommandHandlerError>>;

  /**
   * Execute a command as a UnitOfWork to include
   * everything in a single atomic database transaction.
   */
  execute(
    command: BaseCommand,
  ): Promise<Result<CommandHandlerReturnType, CommandHandlerError>> {
    return this.unitOfWork.execute(command.correlationId, async () =>
      this.handle(command),
    );
  }

}
