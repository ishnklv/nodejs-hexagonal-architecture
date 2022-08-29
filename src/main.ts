import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { configOptions, loggerConfig, routes, swaggerConfig, swaggerOptions } from './shared/configs';
import { SwaggerModule } from '@nestjs/swagger';
import { EnvUtils } from '@libs/utils';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig(),
  });

  const logger = new Logger('Bootstrap');
  logger.log(`Using .env file ${configOptions.envFilePath}`);

  if (EnvUtils.isLocal()) {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(routes.swagger, app, document, swaggerOptions);
    fs.mkdirSync('./api', { recursive: true });
    fs.writeFileSync('./api/server.yaml', yaml.dump(document));
    logger.log('Creating OpenAPI docs at ./api/server.yaml');
  }

  app.enableShutdownHooks();

  await app
    .listen(process.env.PORT || 3000)
    .then(async () => logger.log(`Server is listening on ${await app.getUrl()}`));
}

bootstrap();
