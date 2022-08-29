import { ApiProperty } from '@nestjs/swagger';
import { User } from '@interfaces/user/user.interface';
import { BaseEntityResponse } from '@libs/libs/base';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

export class UserResponse extends BaseEntityResponse implements User {

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@doe.com',
    type: String,
  })
  email: string;

  constructor(user: UserEntity) {
    super(user);
    this.name = user?.name;
    this.email = user?.email;
  }

}
