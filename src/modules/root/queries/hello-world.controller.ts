import { Controller, Get } from '@nestjs/common';
import { routes } from '@config/app.routes';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthHeaders } from '@src/decorators';
import { BaseController, Result } from '@libs/libs/base';
import { HelloWorldService } from '@modules/root/queries/hello-world.service';

@ApiTags('root')
@Controller()
export class HelloWorldController extends BaseController {

  constructor(private readonly helloWorldService: HelloWorldService) {
    super();
  }

  @Get(routes.root)
  @AuthHeaders()
  @ApiOperation({
    summary: 'Return "Hello World!"',
    description: 'Returns the string Hello World!',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
  })
  async handle(): Promise<string> {
    const result: Result<string> = await this.helloWorldService.handle();
    return result.unwrap();
  }
}
