import { ArgumentsHost, Catch, ExceptionFilter, Global, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

/**
 * The AllExceptionsFilter catches all thrown errors,
 * logs them and adds the error to the http response.
 *
 * There cannot be multiple filters for all error types.
 * See https://stackoverflow.com/questions/54727103/nestjs-how-to-pass-the-error-from-one-error-filter-to-another
 */
@Global()
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger();

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();

    this.logger.error(exception, exception.stack, `Exception ${request.url}`);

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      path: request.url,
      cause: exception,
      timestamp: new Date().toISOString(),
    });
  }
}
