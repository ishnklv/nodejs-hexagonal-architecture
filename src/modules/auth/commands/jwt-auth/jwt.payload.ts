export class JwtPayload {

  /**
   * The Subject Claim. It contains the id of the user.
   */
  readonly sub: string;

  /**
   * The email of the subject.
   */
  readonly email: string;

  /**
   * The Issued At Claim as UNIX time.
   */
  readonly iat: number;

}
