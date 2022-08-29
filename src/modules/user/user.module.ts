import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './repository/user.orm-entity';
import { UserRepositoryInterface } from './repository/user.repository.interface';
import { UserRepository } from './repository/user.repository';
import { CrudUserController } from './crud/crud.controller';
import { ValidateUserService } from './commands/validate-user/validate-user.service';
import { CustomUseCaseService } from './commands/custom-use-case/custom-use-case.service';
import { CustomUseCaseController } from './commands/custom-use-case/custom-use-case.controller';
import { CrudUserService } from './crud/crud.service';
import { UserCreatedEventHandler } from './event-handlers/user-created.event-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [
    CrudUserController,
    CustomUseCaseController,
  ],
  providers: [
    {
      provide: UserRepositoryInterface,
      useClass: UserRepository,
    },
    CrudUserService,
    CustomUseCaseService,
    ValidateUserService,
    UserCreatedEventHandler,
  ],
  exports: [
    {
      provide: UserRepositoryInterface,
      useClass: UserRepository,
    },
    ValidateUserService,
  ],
})
export class UserModule {
}
