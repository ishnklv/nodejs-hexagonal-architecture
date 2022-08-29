import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUser } from '@interfaces/user/update-user.interface';
import { BaseRequest } from '@libs/libs/base';

export class UpdateUserRequest extends BaseRequest implements UpdateUser {

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    type: String,
    required: false,
  })
  name: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@doe.com',
    type: String,
    required: false,
  })
  email: string;

}
