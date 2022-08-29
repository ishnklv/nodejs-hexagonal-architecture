import { ValidationPipeOptions } from '@nestjs/common';

export const validationPipeConfig: ValidationPipeOptions = {
  disableErrorMessages: false,
  dismissDefaultMessages: false,
  validateCustomDecorators: true,
  validationError: {
    target: true,
    value: true,
  },
};
