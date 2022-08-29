import { ArgumentsHost } from '@nestjs/common';

/**
 * The ArgumentsHostMock mocks the ArgumentsHost.
 *
 * We use this custom mock instead of mocking it via createMock<ArgumentsHost>()
 * because it does not correctly mock the status and json functions.
 */
export class ArgumentsHostMock implements ArgumentsHost {

  private jsonMock = jest.fn();

  private urlMock = jest.fn();

  private statusMock = jest.fn().mockReturnValue({
    json: this.jsonMock,
  });

  private getResponseMock = jest.fn().mockReturnValue({
    status: this.statusMock,
  });

  private getRequestMock = jest.fn().mockReturnValue({
    url: this.urlMock,
  });

  private httpArgumentsHostMock = jest.fn().mockReturnValue({
    getResponse: this.getResponseMock,
    getRequest: this.getRequestMock,
  });

  switchToHttp = this.httpArgumentsHostMock;
  switchToRpc = jest.fn();
  switchToWs = jest.fn();
  getArgs = jest.fn();
  getArgByIndex = jest.fn();
  getType = jest.fn();

}
