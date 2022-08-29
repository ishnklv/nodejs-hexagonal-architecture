import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * The public decorator is used to indicate that a controller does not require
 * any authentication.
 * @constructor
 */
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
