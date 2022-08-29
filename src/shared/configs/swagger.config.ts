import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { googlePassportConfig } from './google-passport.config';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('NestJS Template')
  .setDescription('The API description of the NestJS Template')
  .setVersion(process.env.VERSION)
  .addBearerAuth({
    name: 'JWT',
    description: 'Authentication via JWT',
    type: 'http',
    scheme: 'bearer',
  })
  .addOAuth2({
    name: 'Google OAuth2',
    description: 'OAuth2 with Google',
    type: 'oauth2',
    flows: {
      implicit: {
        authorizationUrl: process.env.AUTHORIZATION_URL,
        tokenUrl: process.env.TOKEN_URL,
        scopes: googlePassportConfig.scope as string[],
      },
    },
  })
  .build();

export const swaggerOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'NestJS Template',
};
