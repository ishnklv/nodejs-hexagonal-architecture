import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthGuardType } from '@libs/constants';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(AuthGuardType.Google) {
}
