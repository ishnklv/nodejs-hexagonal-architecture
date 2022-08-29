import { Column, Entity } from 'typeorm';
import { UuidBaseOrmEntity } from '@libs/libs/base/modules/repository/uuid-base.orm-entity';

@Entity('user')
export class UserOrmEntity extends UuidBaseOrmEntity {

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

}
