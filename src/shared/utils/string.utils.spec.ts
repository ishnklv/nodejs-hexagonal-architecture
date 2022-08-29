import { StringUtils } from './string.utils';

describe(StringUtils.name, () => {

  describe(StringUtils.removeBlanks.name, () => {

    it('should remove blanks from string', () => {
      const stringWithBlanks = '   te   st   ';

      const stringWithoutBlanks = StringUtils.removeBlanks(stringWithBlanks);

      expect(stringWithoutBlanks).toEqual('test');
    });

    it('should return an empty string', () => {
      const emptyString = StringUtils.removeBlanks('');

      expect(emptyString).toEqual('');
    });

    it('should return undefined when null is passed', () => {
      const nullString = StringUtils.removeBlanks(null);

      expect(nullString).toBeUndefined();
    });

  });

  describe(StringUtils.removeSpecialCharacters.name, () => {

    it('should remove all special characters', () => {
      const stringWithSpecialCharacters = '@te*st#';

      const stringWithoutSpecialCharacters = StringUtils.removeSpecialCharacters(stringWithSpecialCharacters);

      expect(stringWithoutSpecialCharacters).toEqual('test');
    });

    it('should return undefined when null is passed', () => {
      const nullString = StringUtils.removeSpecialCharacters(null);

      expect(nullString).toBeUndefined();
    });

  });

});
