import { Test } from '@nestjs/testing';
import { CustomUseCaseService } from '@modules/user/commands/custom-use-case/custom-use-case.service';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepositoryMock } from '@modules/user/repository/user.repository.mock';
import { CustomUseCaseCommand } from '@modules/user/commands/custom-use-case/custom-use-case.command';
import { UnitOfWork } from '@modules/shared/database/unit-of-work';
import { Uuid } from '@libs/libs/base';
import { TestUtils } from '@libs/utils/test.utils';

describe(CustomUseCaseService.name, () => {

  let service: CustomUseCaseService;
  let userMock: UserEntity;

  beforeEach(async () => {
    const name = 'John Doe';
    const email = 'john@doe.com';
    userMock = new UserEntity({ id: Uuid.generate(), props: { name, email } });

    const module = await Test.createTestingModule({
      providers: [
        CustomUseCaseService,
        {
          provide: UnitOfWork,
          useValue: {
            getUserRepository: jest.fn().mockReturnValue(new UserRepositoryMock({
              findOne: userMock,
              saveOne: userMock,
            })),
          },
        },
      ],
    }).compile();

    service = module.get(CustomUseCaseService);
  });

  describe('Custom user use case', () => {

    it('should execute the custom use case', async () => {
      const name = 'John Doe';
      const email = 'john@doe.com';
      const command = new CustomUseCaseCommand({
        id: Uuid.generate().value,
        correlationId: Uuid.generate().value,
        name,
        email,
      });
      const id = await service.handle(command);
      expect(id.unwrap().value).not.toBeNull();
      expect(id.unwrap().value).toMatch(TestUtils.uuidRegex);
    });

  });

});
