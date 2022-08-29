import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { googlePassportConfig } from '@config/google-passport.config';
import { AuthGuardType } from '@libs/constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, AuthGuardType.Google) {

  constructor() {
    super(googlePassportConfig);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }

}
