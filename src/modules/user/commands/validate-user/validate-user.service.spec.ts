import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ValidateUserService } from '@modules/user/commands/validate-user/validate-user.service';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { ValidateUserQuery } from '@modules/user/commands/validate-user/validate-user.query';
import { Uuid } from '@libs/libs/base';
import { UserRepositoryMock } from '@modules/user/repository/user.repository.mock';
import { UserRepositoryInterface } from '@modules/user/repository/user.repository.interface';

describe(ValidateUserService.name, () => {
  let service: ValidateUserService;

  const initService = async (userMock: UserEntity) => {
    const app = await Test.createTestingModule({
      providers: [
        ValidateUserService,
        {
          provide: UserRepositoryInterface,
          useValue: new UserRepositoryMock({ findOne: userMock }),
        },
      ],
    }).compile();

    service = app.get(ValidateUserService);
  };

  describe('User validation', () => {

    it('should validate that the user is authenticated', async () => {
      const userMock = new UserEntity({ id: Uuid.generate(), props: { name: 'John Doe', email: 'john@doe.com' } });
      await initService(userMock);

      const email = 'john@doe.com';
      const command = new ValidateUserQuery({
        email,
      });
      const user = await service.handle(command);

      expect(user).toBeDefined();
      expect(user.unwrap().email).toEqual(email);
    });

    it('should throw UnauthorizedException if the user is not authenticated', async () => {
      await initService(null);

      const email = 'invalid@email.com';
      const command = new ValidateUserQuery({
        email,
      });

      const result = (await service.handle(command));
      expect(result.isErr).toBeTruthy();
      let err;
      result.map(null, (error: UnauthorizedException) => err = error);
      expect(err).toStrictEqual(new UnauthorizedException());
    });

  });

});
