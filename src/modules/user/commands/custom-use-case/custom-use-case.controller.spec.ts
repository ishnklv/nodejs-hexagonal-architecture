import { Test, TestingModule } from '@nestjs/testing';
import { CustomUseCaseController } from '@modules/user/commands/custom-use-case/custom-use-case.controller';
import { CustomUseCaseRequest } from '@modules/user/commands/custom-use-case/custom-use-case.request';
import { Uuid } from '@libs/libs/base';
import { CommandBus } from '@nestjs/cqrs';

describe(CustomUseCaseController.name, () => {
  let controller: CustomUseCaseController;
  const idValue = 'd9733a0a-208d-4096-bd38-d163c0871b4c';
  const idMock = new Uuid(idValue);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CustomUseCaseController],
      providers: [{
        provide: CommandBus,
        useValue: {
          execute: jest.fn().mockReturnValue(idMock),
        },
      }],
    }).compile();

    controller = app.get<CustomUseCaseController>(CustomUseCaseController);
  });

  describe('Custom use case', () => {

    it('should return the users id', async () => {
      const body = new CustomUseCaseRequest();
      body.name = 'John Doe';
      body.email = 'john@doe.com';
      const idResponse = await controller.handle(body);
      expect(idResponse.id).toBe(idValue);
    });

  });

});
