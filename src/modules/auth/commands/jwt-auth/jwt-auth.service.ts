import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload';
import { BaseCommandHandlerService, Result } from '@libs/libs/base';
import { JwtAuthCommand } from '@modules/auth/commands/jwt-auth/jwt-auth.command';
import { JwtAuthResult } from '@modules/auth/commands/jwt-auth/jwt-auth.result';
import { UnitOfWork } from '@modules/shared/database/unit-of-work';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(JwtAuthCommand)
export class JwtAuthService extends BaseCommandHandlerService {

  constructor(protected readonly unitOfWork: UnitOfWork,
              private readonly jwtService: JwtService) {
    super(unitOfWork);
  }

  async handle(command: JwtAuthCommand): Promise<Result<JwtAuthResult, BadRequestException>> {
    // TODO In a real application, you have to check for a password before logging the user in
    const user = await this.unitOfWork
      .getUserRepository(command.correlationId)
      .findOne({ email: command.email });
    if (!user) {
      return Result.err(new BadRequestException(command));
    }

    const payload: JwtPayload = {
      sub: user.id.value,
      email: user.email,
      iat: new Date().getTime(),
    };
    return Result.ok({
      access_token: this.jwtService.sign(payload),
    });
  }
}
