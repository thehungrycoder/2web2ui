import { all, any } from '../compose';

describe('Condition Helper: compose conditions', () => {

  describe('all (and)', () => {

    it('should call all given functions and return true when all return true', () => {
      const c1 = jest.fn(() => true);
      const c2 = jest.fn(() => true);
      const c3 = jest.fn(() => true);

      const opts = {};
      const composed = all(c1, c2, c3);
      const result = composed(opts);

      expect(c1).toHaveBeenCalledWith(opts);
      expect(c2).toHaveBeenCalledWith(opts);
      expect(c3).toHaveBeenCalledWith(opts);
      expect(result).toEqual(true);
    });

    it('should bail and return false when the first function returns false', () => {
      const c1 = jest.fn(() => true);
      const c2 = jest.fn(() => false);
      const c3 = jest.fn(() => true);

      const opts = {};
      const composed = all(c1, c2, c3);
      const result = composed(opts);

      expect(c1).toHaveBeenCalledWith(opts);
      expect(c2).toHaveBeenCalledWith(opts);
      expect(c3).not.toHaveBeenCalled();
      expect(result).toEqual(false);
    });

  });

  describe('any (or)', () => {

    it('should call all given functions and return false when all return false', () => {
      const c1 = jest.fn(() => false);
      const c2 = jest.fn(() => false);
      const c3 = jest.fn(() => false);

      const opts = {};
      const composed = any(c1, c2, c3);
      const result = composed(opts);

      expect(c1).toHaveBeenCalledWith(opts);
      expect(c2).toHaveBeenCalledWith(opts);
      expect(c3).toHaveBeenCalledWith(opts);
      expect(result).toEqual(false);
    });

    it('should bail and return true when the first function returns true', () => {
      const c1 = jest.fn(() => false);
      const c2 = jest.fn(() => true);
      const c3 = jest.fn(() => false);

      const opts = {};
      const composed = any(c1, c2, c3);
      const result = composed(opts);

      expect(c1).toHaveBeenCalledWith(opts);
      expect(c2).toHaveBeenCalledWith(opts);
      expect(c3).not.toHaveBeenCalled();
      expect(result).toEqual(true);
    });

  });

});
