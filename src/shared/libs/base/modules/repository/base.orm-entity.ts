import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * The entity that is persisted.
 */
export abstract class BaseOrmEntity {

  /**
   * The concrete type of id has to be defined in a sub-class.
   */
  id!: string;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt!: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    update: false,
  })
  createdAt!: Date;

  constructor(props?: unknown) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
