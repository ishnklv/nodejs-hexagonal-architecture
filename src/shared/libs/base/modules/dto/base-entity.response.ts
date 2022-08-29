import { BaseEntityProps } from '@libs/libs/base';
import { IdResponse } from '@modules/shared/commands/id.response';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntityResponse extends IdResponse {

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  createdAt: string;
  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  updatedAt: string;

  constructor(entity: BaseEntityProps) {
    super(entity?.id.value);
    this.createdAt = entity?.createdAt.value.toISOString();
    this.updatedAt = entity?.updatedAt.value.toISOString();
  }
}
