import { Body, Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { apiTags, routes } from '../../../../shared/configs';
import { BaseController } from '@libs/libs/base';

@ApiTags(apiTags.login)
@Controller()
export class GoogleAuthCallbackController extends BaseController {

  @Get(routes.auth.googleCallback)
  @ApiOperation({
    summary: 'The callback for google oauth2',
    description: 'The callback that is called when the oauth was successful',
  })
  async handle(@Body() body: unknown): Promise<any> {
    // TODO Create user if not yet created
  }

}
