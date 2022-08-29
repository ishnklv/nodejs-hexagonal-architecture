import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseRequest } from '@libs/libs/base';

export class JwtRequest extends BaseRequest {

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user to authenticate',
    type: String,
    example: 'admin@nestjs-template.com',
    required: true,
  })
  email: string;

}
