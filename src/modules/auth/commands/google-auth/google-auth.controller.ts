import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { apiTags, routes } from '../../../../shared/configs';
import { GoogleAuthGuard } from '@src/guards';
import { BaseController } from '@libs/libs/base';

@ApiTags(apiTags.login)
@Controller()
export class GoogleAuthController extends BaseController {

  @Get(routes.auth.google)
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Login with google oauth2',
    description: 'Login with google oauth2',
  })
  async handle(@Body() body: unknown): Promise<any> {
    // TODO Create user if not yet created
  }

}
