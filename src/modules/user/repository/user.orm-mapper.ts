import { UserEntity, UserProps } from '../domain/entities/user.entity';
import { BaseOrmMapper, EntityProps, OrmEntityProps } from '@libs/libs/base';
import { UserOrmEntity } from '@modules/user/repository/user.orm-entity';
import { Uuid } from '@libs/libs/base/modules/domain/value-object/uuid.value-object';

export class UserOrmMapper extends BaseOrmMapper<UserEntity, UserOrmEntity> {

  protected toDomainProps(ormEntity: UserOrmEntity): EntityProps<UserProps> {
    return {
      id: new Uuid(ormEntity.id),
      props: {
        name: ormEntity.name,
        email: ormEntity.email,
      },
    };
  }

  protected toOrmProps(entity: UserEntity): OrmEntityProps<UserOrmEntity> {
    const props = entity.getPropsCopy();
    return {
      name: props.name,
      email: props.email,
    };
  }

}
