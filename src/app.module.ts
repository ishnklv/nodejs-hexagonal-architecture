import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './filters';
import { HttpLoggerInterceptor } from './interceptors';
import { AuthModule, HealthModule, RootModule, SharedModule, UserModule } from './modules';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configOptions } from '@config/config.config';
import { ormConfig } from '@config/orm.config';
import { validationPipeConfig } from '@config/validation-pipe.config';
import { SeedModule } from '@modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRoot(ormConfig),
    SharedModule,
    RootModule,
    AuthModule,
    HealthModule,
    UserModule,
    SeedModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(validationPipeConfig),
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
  ],
})
export class AppModule {
}
