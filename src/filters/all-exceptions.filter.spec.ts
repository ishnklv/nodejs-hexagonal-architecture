import { AllExceptionsFilter } from './all-exceptions.filter';
import { Test } from '@nestjs/testing';
import { ArgumentsHostMock } from './argument-host.mock';
import { BadRequestException, HttpStatus, LoggerService } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe(AllExceptionsFilter.name, () => {
  let filter: AllExceptionsFilter;
  let loggerMock: LoggerService;
  let argumentsHostMock: ArgumentsHostMock;

  beforeEach(async () => {
    argumentsHostMock = new ArgumentsHostMock();
    loggerMock = createMock<LoggerService>();
    const module = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
      ],
    }).setLogger(loggerMock).compile();

    filter = module.get(AllExceptionsFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch an error', () => {
    const error = new Error();
    filter.catch(
      error,
      argumentsHostMock,
    );

    const status = argumentsHostMock.switchToHttp().getResponse().status;
    expect(status).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    const response = status().json.mock.calls[0][0];
    expect(response.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.path).toBeDefined();
    expect(response.cause).toBeDefined();
    expect(response.cause).toEqual(error);
    expect(response.timestamp).toBeDefined();
  });

  it('should return status of HttpError', () => {
    const error = new BadRequestException();
    filter.catch(
      error,
      argumentsHostMock,
    );

    const status = argumentsHostMock.switchToHttp().getResponse().status;
    expect(status).toBeCalledWith(error.getStatus());
    const response = status().json.mock.calls[0][0];
    expect(response.statusCode).toEqual(error.getStatus());
  });

  it('should log stack of error', () => {
    const error = new BadRequestException();
    filter.catch(
      error,
      argumentsHostMock,
    );

    expect(loggerMock.error).toBeCalledTimes(1);
    const url = argumentsHostMock.switchToHttp().getRequest().url;
    expect(loggerMock.error).toBeCalledWith(error, error.stack, `Exception ${url}`);
  });

});
