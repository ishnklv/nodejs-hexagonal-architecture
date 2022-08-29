import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { routes } from "@libs/configs";
import { initApp, tearDown } from "./utils/test.utils";
import { getJwtToken } from "./utils/auth.utils";
import { HttpHeaders } from "@libs/constants";
import { ADMIN_EMAIL } from "./constants/auth";

describe(`${routes.root} (e2e)`, () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeEach(async () => {
    app = await initApp();
    jwtToken = await getJwtToken(app, ADMIN_EMAIL);
  });

  afterEach(async () => {
    await tearDown(app);
  });

  it(`GET ${routes.root}`, () => {
    return request(app.getHttpServer())
      .get(routes.root)
      .set(HttpHeaders.Authorization, `Bearer ${jwtToken}`)
      .expect(200);
  });
});
