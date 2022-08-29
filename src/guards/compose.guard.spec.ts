import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ComposeGuard } from './compose.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuardType } from '@libs/constants';
import { Environment } from '@config/env.config';

describe(ComposeGuard.name, () => {

  let guard: ComposeGuard;
  let jwtGuard: JwtAuthGuard;
  let googleGuard: GoogleAuthGuard;
  let reflector: Reflector;
  const processEnv = process.env;

  beforeEach(async () => {
    process.env = { ...processEnv };
    const module = await Test.createTestingModule({
      providers: [
        ComposeGuard,
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn(),
          },
        },
        {
          provide: GoogleAuthGuard,
          useValue: {
            canActivate: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            constructor: jest.fn(),
            get: jest.fn(),
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();
    guard = module.get(ComposeGuard);
    jwtGuard = module.get(JwtAuthGuard);
    googleGuard = module.get(GoogleAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    process.env = processEnv;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true for public annotation', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(() => true);
    const context = createMock<ExecutionContext>();
    const result = await guard.canActivate(context);
    expect(result).toBeTruthy();
  });

  it('should throw BadRequestException for unknown auth type', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(() => false);
    const context = createMock<ExecutionContext>({
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { 'auth-type': 'invalid-auth-type' },
        }),
      }),
    });
    expect(() => guard.canActivate(context)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for local auth type in prod', async () => {
    process.env.NODE_ENV = Environment.Production;
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(() => false);
    const context = createMock<ExecutionContext>({
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { 'auth-type': AuthGuardType.Local },
        }),
      }),
    });
    expect(() => guard.canActivate(context)).toThrow(BadRequestException);
  });

  it('should call google auth for auth type google', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(() => false);
    jest
      .spyOn(googleGuard, 'canActivate')
      .mockImplementation(() => true);
    const context = createMock<ExecutionContext>({
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { 'auth-type': AuthGuardType.Google },
        }),
      }),
    });
    const result = await guard.canActivate(context);
    expect(googleGuard.canActivate).toBeCalledTimes(1);
    expect(jwtGuard.canActivate).toBeCalledTimes(0);
    expect(result).toBeTruthy();
  });

  it('should call jwt auth for auth type jwt', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(() => false);
    jest
      .spyOn(jwtGuard, 'canActivate')
      .mockImplementation(() => true);
    const context = createMock<ExecutionContext>({
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { 'auth-type': AuthGuardType.Jwt },
        }),
      }),
    });
    const result = await guard.canActivate(context);
    expect(jwtGuard.canActivate).toBeCalledTimes(1);
    expect(googleGuard.canActivate).toBeCalledTimes(0);
    expect(result).toBeTruthy();
  });

  it('should call jwt auth for empty auth type', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(() => false);
    jest
      .spyOn(jwtGuard, 'canActivate')
      .mockImplementation(() => true);
    const context = createMock<ExecutionContext>({
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
    });
    const result = await guard.canActivate(context);
    expect(jwtGuard.canActivate).toBeCalledTimes(1);
    expect(googleGuard.canActivate).toBeCalledTimes(0);
    expect(result).toBeTruthy();
  });

});
