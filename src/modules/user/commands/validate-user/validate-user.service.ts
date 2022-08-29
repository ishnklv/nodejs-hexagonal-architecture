import { UnauthorizedException } from '@nestjs/common';
import { BaseQueryHandlerService, Result } from '@libs/libs/base';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { ValidateUserQuery } from '@modules/user/commands/validate-user/validate-user.query';
import { CommandHandler } from '@nestjs/cqrs';
import { UserRepositoryInterface } from '@modules/user/repository/user.repository.interface';

@CommandHandler(ValidateUserQuery)
export class ValidateUserService extends BaseQueryHandlerService {

  constructor(protected readonly userRepo: UserRepositoryInterface) {
    super();
  }

  async handle(command: ValidateUserQuery): Promise<Result<UserEntity, UnauthorizedException>> {
    const user = await this.userRepo
      .findOne({ email: command.email });
    if (!user) {
      return Result.err(new UnauthorizedException());
    }
    return Result.ok(user);
  }
}
