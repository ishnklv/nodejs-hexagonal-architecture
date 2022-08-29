import { CallHandler, ExecutionContext, Global, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpHeaders } from '@libs/constants';
import { Observable, tap } from 'rxjs';
import { JwtPayload } from '@modules/auth/commands/jwt-auth/jwt.payload';

/**
 * A logger to log the called method of http requests
 */
@Global()
@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor<unknown, Response> {

  private readonly logger = new Logger();

  constructor(private readonly jwtService: JwtService) {
  }

  intercept(context: ExecutionContext, next: CallHandler<Response>): Observable<Response> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const calleeName = className + ' ' + handlerName;

    const jwtToken = request.headers[HttpHeaders.Authorization]?.split(' ')[1];
    const decodedJwt = jwtToken ? this.jwtService.decode(jwtToken) as JwtPayload : undefined;
    const userId = decodedJwt?.sub ? ` [${decodedJwt?.sub}]` : '';

    this.logger.log(`[Request ${url}]${userId}`, calleeName);

    return next
      .handle()
      .pipe(
        tap(() => {
          this.logger.log(`[Response ${url}]${userId}`, calleeName);
        }),
      );
  }
}
