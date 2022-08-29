import { BadRequestException, CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators';
import { Reflector } from '@nestjs/core';
import { EnvUtils } from '@libs/utils';
import { Observable } from 'rxjs';
import { AuthGuardType, HttpHeaders } from '../shared/constants';

/**
 * The ComposeGuard handles authentication.
 *
 * Depending on the value of header `auth-type`, the respective
 * auth mechanism is used.
 * If no auth-type is provided, jwt is used.
 */
@Injectable()
export class ComposeGuard implements CanActivate {

  private readonly logger = new Logger();

  constructor(private readonly reflector: Reflector,
              private readonly jwtAuth: JwtAuthGuard,
              private readonly googleAuth: GoogleAuthGuard) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      this.logger.debug(
        `Public annotation found. No authentication necessary`,
        `${context.getClass().name} ${context.getHandler().name}`,
      );
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const authType = request.headers[HttpHeaders.AuthType];

    if (authType && !Object.values(AuthGuardType).includes(authType as AuthGuardType)) {
      throw new BadRequestException(`${authType} is not a valid authentication type`);
    }
    if (authType === AuthGuardType.Local && !(EnvUtils.isLocal() || EnvUtils.isTest())) {
      throw new BadRequestException(`${authType} is not supported`);
    }

    switch (authType as AuthGuardType) {
      case AuthGuardType.Google:
        return this.googleAuth.canActivate(context);
      case AuthGuardType.Jwt:
      default:
        return this.jwtAuth.canActivate(context);
    }
  }

}
