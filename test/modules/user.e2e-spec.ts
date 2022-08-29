import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { routes } from '@config/app.routes';
import { initApp, tearDown } from '../utils/test.utils';
import { getJwtToken } from '../utils/auth.utils';
import { HttpHeaders } from '@libs/constants';
import { UserOrmEntity } from '@modules/user/repository/user.orm-entity';
import { ADMIN_EMAIL } from "../constants/auth";

describe(`${routes.users.root} (e2e)`, () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeEach(async () => {
    app = await initApp();
    jwtToken = await getJwtToken(app, ADMIN_EMAIL);
  });

  afterEach(async () => {
    await tearDown(app);
  });

  it(`GET ${routes.users.get}`, () => {
    return request(app.getHttpServer())
      .get(`${routes.users.root}/aae6f654-f661-4ac8-b71d-1820af214dc9`)
      .set(HttpHeaders.Authorization, `Bearer ${jwtToken}`)
      .expect(200);
  });

  it(`GET ${routes.users.get} invalid id`, () => {
    return request(app.getHttpServer())
      .get(`${routes.users.root}/not-a-valid-user-id`)
      .set(HttpHeaders.Authorization, `Bearer ${jwtToken}`)
      .expect(400);
  });

  it(`GET ${routes.users.getMultiple}`, () => {
    return request(app.getHttpServer())
      .get(routes.users.getMultiple)
      .set(HttpHeaders.Authorization, `Bearer ${jwtToken}`)
      .expect(200);
  });

  it(`GET ${routes.users.create}`, () => {
    return request(app.getHttpServer())
      .post(`${routes.users.create}`)
      .set(HttpHeaders.Authorization, `Bearer ${jwtToken}`)
      .send({
        name: 'New User',
        email: 'new@user.com',
      })
      .expect(201)
      .expect(({ body }: { body: UserOrmEntity }) => {
        expect(body.name).toEqual('New User');
        expect(body.email).toEqual('new@user.com');
      });
  });

  it(`POST ${routes.users.createMultiple}`, () => {
    return request(app.getHttpServer())
      .post(`${routes.users.createMultiple}`)
      .set(HttpHeaders.Authorization, `Bearer ${jwtToken}`)
      .send({
        'bulk': [{
          name: 'New User 1',
          email: 'new@user1.com',
        }, {
          name: 'New User 2',
          email: 'new@user2.com',
        }],
      })
      .expect(201)
      .expect(({ body }: { body: UserOrmEntity[] }) => {
        expect(body[0].name).toEqual('New User 1');
        expect(body[0].email).toEqual('new@user1.com');
        expect(body[1].name).toEqual('New User 2');
        expect(body[1].email).toEqual('new@user2.com');
      });
  });

  it(`PATCH ${routes.users.update}`, () => {
    return request(app.getHttpServer())
      .patch(`${routes.users.root}/aae6f654-f661-4ac8-b71d-1820af214dc9`)
      .set(HttpHeaders.Authorization, `Bearer ${jwtToken}`)
      .send({
        name: 'New User Name',
      })
      .expect(200)
      .expect(({ body }: { body: UserOrmEntity }) => {
        expect(body.name).toEqual('New User Name');
      });
  });

  it(`PUT ${routes.users.replace}`, () => {
    return request(app.getHttpServer())
      .put(`${routes.users.root}/aae6f654-f661-4ac8-b71d-1820af214dc9`)
      .set(HttpHeaders.Authorization, `Bearer ${jwtToken}`)
      .send({
        name: 'New User Name',
        email: 'new@email.com',
      })
      .expect(200)
      .expect(({ body }: { body: UserOrmEntity }) => {
        expect(body.name).toEqual('New User Name');
        expect(body.email).toEqual('new@email.com');
      });
  });

  it(`DELETE ${routes.users.delete}`, () => {
    return request(app.getHttpServer())
      .delete(`${routes.users.root}/aae6f654-f661-4ac8-b71d-1820af214dc9`)
      .set(HttpHeaders.Authorization, `Bearer ${jwtToken}`)
      .expect(200);
  });
});
