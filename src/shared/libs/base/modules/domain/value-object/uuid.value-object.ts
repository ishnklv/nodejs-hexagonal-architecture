import { DomainPrimitive } from '@libs/libs/base';
import { v4 as uuidV4, validate } from 'uuid';
import { ArgumentInvalidError } from '@errors';
import { Id } from './id.value-object';

export class Uuid extends Id {

  /**
   * Returns new id instance with randomly generated id value
   */
  static generate(): Uuid {
    return new Uuid(uuidV4());
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (!validate(value)) {
      throw new ArgumentInvalidError('Incorrect UUID format');
    }
  }
}
