import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseRequest } from '@libs/libs/base';

export class CustomUseCaseRequest extends BaseRequest {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    type: String,
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@doe.com',
    type: String,
    required: true,
  })
  email: string;

}
