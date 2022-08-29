import { Body, Controller, Post } from '@nestjs/common';
import { apiTags, routes } from '@config/index';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthHeaders } from '@src/decorators';
import { BaseController, Id } from '@libs/libs/base';
import { IdResponse } from '@modules/shared/commands/id.response';
import { CustomUseCaseRequest } from '@modules/user/commands/custom-use-case/custom-use-case.request';
import { CustomUseCaseCommand } from '@modules/user/commands/custom-use-case/custom-use-case.command';
import { CommandBus } from '@nestjs/cqrs';

@ApiTags(apiTags.users)
@Controller()
export class CustomUseCaseController extends BaseController {

  constructor(private readonly commandBus: CommandBus<CustomUseCaseCommand>) {
    super();
  }

  @Post(routes.users.custom)
  @AuthHeaders()
  @ApiOperation({
    summary: 'Custom user use case',
    description: 'Custom user use case',
  })
  @ApiBody({
    description: 'The request body for the custom use case',
    type: CustomUseCaseRequest,
  })
  @ApiOkResponse({
    description: 'Success',
    type: IdResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Invalid user input',
  })
  async handle(@Body() body: CustomUseCaseRequest): Promise<IdResponse> {
    const command = new CustomUseCaseCommand({
      name: body.name,
      email: body.email,
    });

    const id = await this.commandBus.execute<CustomUseCaseCommand, Id>(command);

    return new IdResponse(id.value);
  }
}
