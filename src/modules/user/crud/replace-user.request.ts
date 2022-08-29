import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUser } from '@interfaces/user/create-user.interface';
import { BaseRequest } from '@libs/libs/base';

export class ReplaceUserRequest extends BaseRequest implements CreateUser {

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
  @IsEmail()
  @IsString()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@doe.com',
    type: String,
    required: true,
  })
  email: string;

}
