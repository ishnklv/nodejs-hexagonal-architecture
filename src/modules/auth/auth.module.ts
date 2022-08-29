import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuardType } from '@libs/constants';
import { ComposeGuard } from '@src/guards/compose.guard';
import { GoogleAuthGuard, JwtAuthGuard, LocalAuthGuard } from '../../guards';
import { LocalAuthStrategy } from './commands/jwt-auth/local-auth.strategy';
import { JwtStrategy } from './commands/jwt-auth/jwt.strategy';
import { JwtAuthController } from './commands/jwt-auth/jwt-auth.controller';
import { JwtAuthService } from './commands/jwt-auth/jwt-auth.service';
import { GoogleAuthCallbackController } from './commands/google-auth/google-callback.controller';
import { GoogleAuthController } from './commands/google-auth/google-auth.controller';
import { GoogleStrategy } from './commands/google-auth/google.strategy';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: AuthGuardType.Combined,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
  ],
  controllers: [
    JwtAuthController,
    GoogleAuthController,
    GoogleAuthCallbackController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ComposeGuard,
    },
    LocalAuthGuard,
    LocalAuthStrategy,
    GoogleAuthGuard,
    GoogleStrategy,
    JwtAuthGuard,
    JwtAuthService,
    JwtStrategy,
  ],
  exports: [
    JwtModule,
  ],
})
export class AuthModule {

}
