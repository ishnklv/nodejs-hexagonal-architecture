import { Injectable } from '@nestjs/common';
import { BaseQueryHandlerService, Result } from '@libs/libs/base';

@Injectable()
export class HelloWorldService extends BaseQueryHandlerService {

  async handle(): Promise<Result<string, Error>> {
    return Result.ok('Hello World!');
  }
}
