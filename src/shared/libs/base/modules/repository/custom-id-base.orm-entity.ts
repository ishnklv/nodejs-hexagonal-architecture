import { BaseOrmEntity } from '@libs/libs/base';
import { PrimaryColumn } from 'typeorm';

/**
 * Orm Entity with a custom id
 */
export abstract class CustomIdBaseOrmEntity extends BaseOrmEntity {

  @PrimaryColumn({ update: false })
  id!: string;

}
