import { BaseAggregate } from '@libs/libs/base';
import { UserCreatedDomainEvent } from '@modules/user/domain/events/user-created.domain-event';
import { Uuid } from '@libs/libs/base/modules/domain/value-object/uuid.value-object';

export interface UserProps {
  /**
   * The full name of the user.
   */
  name: string;
  /**
   * The email address of the user.
   */
  email: string;
}

export class UserEntity extends BaseAggregate<UserProps> {

  protected readonly _id: Uuid;

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  static create(props: UserProps): UserEntity {
    const id = Uuid.generate();
    const user = new UserEntity({ id, props });
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
      }),
    );
    return user;
  }

  validate(): void {
    // TODO Validate user props
  }

}
