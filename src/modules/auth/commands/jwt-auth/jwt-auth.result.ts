import { BaseResult } from '@libs/libs/base';

export class JwtAuthResult extends BaseResult {
  access_token: string;
}
