import { BaseAggregate, BaseOrmEntity, CreateEntityProps, DateValueObject, Id } from '@libs/libs/base';

/**
 * The properties of an orm entity.
 */
export type OrmEntityProps<OrmEntity> = Omit<OrmEntity, 'id' | 'createdAt' | 'updatedAt'>;

export interface EntityProps<EntityProps> {
  id: Id;
  props: EntityProps;
}

/**
 * The OrmMapper handles mapping between domain entities and
 * orm entities.
 */
export abstract class BaseOrmMapper<Entity extends BaseAggregate<unknown>, OrmEntity> {

  constructor(
    private entityConstructor: new (props: CreateEntityProps<any>) => Entity,
    private ormEntityConstructor: new (...args: any[]) => OrmEntity,
  ) {
  }

  /**
   * Converts the respective props of the given orm entity
   * (which is implemented in the children of the BaseOrmMapper),
   * as well as the props of the BaseOrmEntity to the props of the BaseEntity.
   * @param ormEntity
   */
  toDomainEntity(ormEntity: OrmEntity): Entity {
    const { id, props } = this.toDomainProps(ormEntity);
    const ormEntityBase: BaseOrmEntity = (ormEntity as unknown) as BaseOrmEntity;
    return new this.entityConstructor({
      id,
      props,
      createdAt: new DateValueObject(ormEntityBase.createdAt),
      updatedAt: new DateValueObject(ormEntityBase.updatedAt),
    });
  }

  /**
   * Converts the respective props of the given entity
   * (which is implemented in the children of the BaseOrmMapper),
   * as well as the props of the BaseEntity to the props of the BaseOrmEntity.
   * @param entity
   */
  toOrmEntity(entity: Entity): OrmEntity {
    const props = this.toOrmProps(entity);
    return new this.ormEntityConstructor({
      ...props,
      id: entity.id.value,
      createdAt: entity.createdAt.value,
      updatedAt: entity.updatedAt.value,
    });
  }

  /**
   * Converts the props of the given orm entity to the props of the domain entity.
   * @param ormEntity
   * @return The domain entity props
   * @protected
   */
  protected abstract toDomainProps(ormEntity: OrmEntity): EntityProps<unknown>;

  /**
   * Converts the props of the given entity to the respective orm entity props.
   * @param entity
   * @protected
   */
  protected abstract toOrmProps(entity: Entity): OrmEntityProps<OrmEntity>;

}
