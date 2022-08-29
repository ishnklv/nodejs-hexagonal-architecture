import { BaseResponse } from '@libs/libs/base';
import { ApiProperty } from '@nestjs/swagger';

export class JwtResponse extends BaseResponse {

  @ApiProperty({
    description: 'The access token for a user',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5AZG9lLmNvbSIsInN1YiI6eyJwcm9wcyI6eyJ2YWx1ZSI6ImFhZTZmNjU0LWY2NjEtNGFjOC1iNzFkLTE4MjBhZjIxNGRjOSJ9fSwiaWF0IjoxNjI1NjQxNTkzfQ.oYkSbM0mroIMOXbw2Z_Lckbk1_EJ0Y1-mzOhVGwphZI',
  })
  access_token: string;
}
