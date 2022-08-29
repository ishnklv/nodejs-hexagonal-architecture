import { ArgumentInvalidError } from '@errors';
import { Uuid } from './uuid.value-object';
import { TestUtils } from '@libs/utils/test.utils';

describe(Uuid.name, () => {

  it('should generate a UUID V4', () => {
    const uuid = Uuid.generate();

    expect(uuid.value).toMatch(TestUtils.uuidRegex);
  });

  it('should throw ArgumentNotProvidedError for empty value', () => {
    expect(() => new Uuid(null)).toThrow(ArgumentInvalidError);
  });

  it('should throw ArgumentInvalidError for incorrect id format', () => {
    expect(() => new Uuid('invalid-id-format')).toThrow(ArgumentInvalidError);
  });

  it('should not throw an error for correct validation', () => {
    expect(() => new Uuid(Uuid.generate().value)).not.toThrow(ArgumentInvalidError);
  });

});
