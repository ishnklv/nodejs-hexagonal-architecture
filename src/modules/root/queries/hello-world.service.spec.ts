import { Test, TestingModule } from '@nestjs/testing';
import { HelloWorldService } from '@modules/root/queries/hello-world.service';

describe(HelloWorldService.name, () => {
  let service: HelloWorldService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [HelloWorldService],
    }).compile();

    service = app.get<HelloWorldService>(HelloWorldService);
  });

  describe('root', () => {

    it('should return "Hello World!"', async () => {
      const result = await service.handle();
      expect(result.unwrap()).toBe('Hello World!');
    });
  });
});
