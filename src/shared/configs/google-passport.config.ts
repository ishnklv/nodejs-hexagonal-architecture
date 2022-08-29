import { _StrategyOptionsBase } from 'passport-google-oauth20';
import { routes } from './app.routes';

export const googlePassportConfig: _StrategyOptionsBase = {
  authorizationURL: process.env.AUTHORIZATION_URL,
  tokenURL: process.env.TOKEN_URL,
  clientID: process.env.GOOGLE_CLIENT_ID || "clientID",
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: `${process.env.HOST}:${process.env.PORT}${routes.auth.googleCallback}`,
  scope: ['email', 'profile'],
};
