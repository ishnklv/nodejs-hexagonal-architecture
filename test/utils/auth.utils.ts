import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { routes } from '../../src/shared/configs';

/**
 * Authenticate with the given email.
 *
 * @param app
 * @param email
 */
export const getJwtToken = async (app: INestApplication, email: string): Promise<string> => {
  const response = await request(app.getHttpServer())
    .post(routes.auth.jwt)
    .send({
      email: email,
    });

  return response.body?.access_token;
};
