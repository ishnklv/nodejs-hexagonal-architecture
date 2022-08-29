import { ArgumentInvalidError } from '@errors';
import { DateValueObject } from '@libs/libs/base';

describe(DateValueObject.name, () => {

  it('should return the current time', () => {
    const dif = DateValueObject.now().value.getTime() - Date.now();
    expect(Math.abs(dif)).toBeLessThan(5);
  });

  it('should throw an ArgumentInvalidError for invalid date', () => {
    expect(() => new DateValueObject('now')).toThrow(ArgumentInvalidError);
  });

});
