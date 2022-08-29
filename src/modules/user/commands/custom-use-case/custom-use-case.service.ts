import { BaseCommandHandlerService, Id, Result } from '@libs/libs/base';
import { CustomUseCaseCommand } from '@modules/user/commands/custom-use-case/custom-use-case.command';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UnitOfWork } from '@modules/shared/database/unit-of-work';
import { Uuid } from '@libs/libs/base/modules/domain/value-object/uuid.value-object';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(CustomUseCaseCommand)
export class CustomUseCaseService extends BaseCommandHandlerService {

  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  async handle(command: CustomUseCaseCommand): Promise<Result<Id, Error>> {
    // Do something in this use case, e.g. duplicate a user with reversed email
    const userRepository = this.unitOfWork
      .getUserRepository(command.correlationId);
    const user = await userRepository
      .findOne({
        name: command.name,
        email: command.email,
      });
    const duplicatedUser = new UserEntity({
      id: Uuid.generate(),
      props: {
        name: [...user.name].reverse().join(''),
        email: [...user.email].reverse().join(''),
      },
    });
    const savedUser = await userRepository.saveOne(duplicatedUser);
    return Result.ok(savedUser.id);
  }

}
