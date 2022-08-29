import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { apiTags, routes } from '../../../shared/configs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthHeaders } from '@src/decorators';
import { BaseController } from '@libs/libs/base';

@ApiTags(apiTags.health)
@Controller()
export class HealthController extends BaseController {

  constructor(private readonly health: HealthCheckService,
              private readonly http: HttpHealthIndicator,
              private readonly db: TypeOrmHealthIndicator) {
    super();
  }

  @Get(routes.health.root)
  @HealthCheck()
  @AuthHeaders()
  @ApiOperation({
    summary: 'Get health status',
    description: 'Get health status of server and database',
  })
  async handle(): Promise<HealthCheckResult> {
    return this.health.check([
      (): Promise<HealthIndicatorResult> => this.http.pingCheck('http', 'https://docs.nestjs.com'),
      (): Promise<HealthIndicatorResult> => this.db.pingCheck('database'),
    ]);
  }

}
