import { Module } from '@nestjs/common';
import { HelloWorldController } from './queries/hello-world.controller';
import { HelloWorldService } from './queries/hello-world.service';

@Module({
  controllers: [
    HelloWorldController,
  ],
  providers: [
    HelloWorldService,
  ],
})
export class RootModule {
}
