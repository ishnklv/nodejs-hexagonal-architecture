import { Test, TestingModule } from '@nestjs/testing';
import { BaseCommandHandlerServiceMock } from '@libs/libs/base';
import { HelloWorldController } from '@modules/root/queries/hello-world.controller';
import { HelloWorldService } from '@modules/root/queries/hello-world.service';

describe(HelloWorldController.name, () => {
  let controller: HelloWorldController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HelloWorldController],
      providers: [{
        provide: HelloWorldService,
        useValue: new BaseCommandHandlerServiceMock('Hello Test World!'),
      }],
    }).compile();

    controller = app.get<HelloWorldController>(HelloWorldController);
  });

  describe('root', () => {

    it('should return "Hello Test World!"', async () => {
      const result = await controller.handle();
      expect(result).toBe('Hello Test World!');
    });
  });
});
