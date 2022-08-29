import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { apiTags, routes } from '../../../../shared/configs';
import { JwtRequest } from './jwt.request';
import { LocalAuthGuard } from '@src/guards';
import { Public } from '@src/decorators';
import { BaseController, Result } from '@libs/libs/base';
import { JwtResponse } from '@modules/auth/commands/jwt-auth/jwt.response';
import { JwtAuthCommand } from '@modules/auth/commands/jwt-auth/jwt-auth.command';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthResult } from '@modules/auth/commands/jwt-auth/jwt-auth.result';

@ApiTags(apiTags.login)
@Controller()
export class JwtAuthController extends BaseController {

  constructor(private readonly commandBus: CommandBus<JwtAuthCommand>) {
    super();
  }

  @Post(routes.auth.jwt)
  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiOperation({
    summary: 'Login with jwt',
    description: 'Login with only the email. No password needed. Not safe for production!',
  })
  @ApiCreatedResponse({
    description: 'Successfully authenticated. Returns a jwt',
    type: JwtResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Error: Unauthorized',
  })
  async handle(@Body() body: JwtRequest): Promise<JwtResponse> {
    const result: Result<JwtAuthResult, BadRequestException> = await this.commandBus.execute(new JwtAuthCommand({ email: body.email }));
    return result.unwrap();
  }

}
