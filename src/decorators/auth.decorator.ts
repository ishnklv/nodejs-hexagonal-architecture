import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOAuth2 } from '@nestjs/swagger';
import { AuthGuardType, HttpHeaders } from '../shared/constants';
import { googlePassportConfig } from '@config/google-passport.config';

/**
 * AuthHeaders combines all api header annotation for swagger that are
 * required for authentication .
 * @constructor
 */
export const AuthHeaders = (): ClassDecorator & MethodDecorator => applyDecorators(
    ApiBearerAuth(),
    ApiOAuth2(googlePassportConfig.scope as string[], AuthGuardType.Google),
    ApiHeader({
        name: HttpHeaders.AuthType,
        description: 'The type of authentication to use. Default is JWT.',
        enum: [AuthGuardType.Jwt, AuthGuardType.Google],
        required: false,
    }),
);
