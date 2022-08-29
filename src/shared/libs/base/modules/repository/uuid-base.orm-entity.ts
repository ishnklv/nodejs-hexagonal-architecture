import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseOrmEntity } from '@libs/libs/base';

/**
 * Orm Entity with a unique id.
 *
 * Entities used in nestjsx/crud need an automatically generated uuid.
 */
export abstract class UuidBaseOrmEntity extends BaseOrmEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

}
