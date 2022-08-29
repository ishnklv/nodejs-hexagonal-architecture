import { BaseAggregate } from '@libs/libs/base';
import { Uuid } from '@libs/libs/base/modules/domain/value-object/uuid.value-object';

/**
 * TestAggregate is an aggregate for testing purposes.
 */
export class TestAggregate extends BaseAggregate<unknown> {

  protected readonly _id: Uuid;

  validate(): void {
    return;
  }

}
