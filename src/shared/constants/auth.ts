/**
 * Types of authentication.
 */
export enum AuthGuardType {
  Combined = 'combined',
  /**
   * Authentication via JSON Web Token.
   */
  Jwt = 'jwt',
  /**
   * Authentication via Google OAuth2
   */
  Google = 'google',
  /**
   * Authentication via email.
   * Not safe for production.
   * @see ComposeGuard
   */
  Local = 'local',
}
