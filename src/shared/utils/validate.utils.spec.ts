import { ArgumentInvalidError } from '@errors';
import { ValidateUtils } from './validate.utils';

describe(ValidateUtils.name, () => {

  describe(ValidateUtils.isEmpty.name, () => {

    it('should return false for number', () => {
      expect(ValidateUtils.isEmpty(0)).toBeFalsy();
      expect(ValidateUtils.isEmpty(999)).toBeFalsy();
      expect(ValidateUtils.isEmpty(-500)).toBeFalsy();
    });

    it('should return false for boolean', () => {
      expect(ValidateUtils.isEmpty(true)).toBeFalsy();
      expect(ValidateUtils.isEmpty(false)).toBeFalsy();
    });

    it('should return true for undefined', () => {
      expect(ValidateUtils.isEmpty(undefined)).toBeTruthy();
    });

    it('should return true for null', () => {
      expect(ValidateUtils.isEmpty(null)).toBeTruthy();
    });

    it('should return false for Date', () => {
      expect(ValidateUtils.isEmpty(new Date())).toBeFalsy();
    });

    it('should return true for an empty object', () => {
      expect(ValidateUtils.isEmpty({})).toBeTruthy();
    });

    it('should return false for a not-empty object', () => {
      expect(ValidateUtils.isEmpty({ prop: 0 })).toBeFalsy();
    });

    it('should return true for an empty array', () => {
      expect(ValidateUtils.isEmpty([])).toBeTruthy();
    });

    it('should return false for a not-empty array', () => {
      expect(ValidateUtils.isEmpty([{ prop: 0 }])).toBeFalsy();
    });

    it('should return true if all objects in array are empty', () => {
      expect(ValidateUtils.isEmpty([{}, {}])).toBeTruthy();
      expect(ValidateUtils.isEmpty([null])).toBeTruthy();
      expect(ValidateUtils.isEmpty([undefined])).toBeTruthy();
    });

    it('should return true for an empty string', () => {
      expect(ValidateUtils.isEmpty('')).toBeTruthy();
    });

    it('should return false for a non-empty string', () => {
      expect(ValidateUtils.isEmpty('string')).toBeFalsy();
    });

  });

  describe(ValidateUtils.lengthIsBetween.name, () => {

    it('should throw error for empty values', () => {
      expect(() => ValidateUtils.lengthIsBetween(null, 0, 1)).toThrow(ArgumentInvalidError);
      expect(() => ValidateUtils.lengthIsBetween(undefined, 0, 1)).toThrow(ArgumentInvalidError);
      expect(() => ValidateUtils.lengthIsBetween([], 0, 1)).toThrow(ArgumentInvalidError);
      expect(() => ValidateUtils.lengthIsBetween('', 0, 1)).toThrow(ArgumentInvalidError);
    });

    it('should return correct values for integers', () => {
      expect(ValidateUtils.lengthIsBetween(0, 1, 1)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(0, 0, 1)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(0, 1, 2)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(10, 2, 2)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(10, 0, 2)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(10, 2, 3)).toBeTruthy();
    });

    it('should return correct values for strings', () => {
      expect(ValidateUtils.lengthIsBetween(' ', 0, 0)).toBeFalsy();
      expect(ValidateUtils.lengthIsBetween(' ', 0, 1)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(' ', 0, 2)).toBeTruthy();

      expect(ValidateUtils.lengthIsBetween(' test ', 6, 6)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(' test ', 5, 6)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(' test ', 6, 7)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(' test ', 0, 1)).toBeFalsy();

      expect(ValidateUtils.lengthIsBetween('a'.repeat(1000), 1000, 1000)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween('a'.repeat(1000), 0, 9999)).toBeTruthy();
    });

    it('should return correct values for arrays', () => {
      expect(ValidateUtils.lengthIsBetween(['a'], 1, 1)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(['a'], 0, 1)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(['a'], 1, 2)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(['a'], 2, 2)).toBeFalsy();

      expect(ValidateUtils.lengthIsBetween(['a', 'b'], 2, 2)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(['a', 'b'], 0, 5)).toBeTruthy();
      expect(ValidateUtils.lengthIsBetween(['a', 'b'], 5, 10)).toBeFalsy();
      expect(ValidateUtils.lengthIsBetween(['a', 'b'], 5, -5)).toBeFalsy();
    });

  });

});
