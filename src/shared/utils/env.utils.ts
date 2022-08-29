import { Environment } from '@libs/configs';

export class EnvUtils {

  static isLocal(): boolean {
    return [Environment.Local].includes(process.env.NODE_ENV as Environment);
  }

  static isTest(): boolean {
    return [Environment.E2e].includes(process.env.NODE_ENV as Environment);
  }

}
