import * as formatting from '../units';

describe('Formatting helpers', () => {
  describe('isNumber', () => {
    it('knows a number when it sees it', () => expect(formatting.isNumber(2.71)).toBeTruthy());
    it('knows a number string when it sees it', () => expect(formatting.isNumber('2.71')).toBeTruthy());
    it('handles Infinity better than humans', () => expect(formatting.isNumber(Infinity)).toBeTruthy());
  });

  describe('roundToPlaces', () => {
    it('should round to specified decimal places', () => {
      expect(formatting.roundToPlaces(2.116, 2)).toBeCloseTo(2.12);
    });
  });

  describe('formatNumber', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatNumber(iceCream)).toBe(iceCream);
    });
    it('should include suffixes where appropriate', () => {
      expect(formatting.formatNumber(999)).toEqual((999).toLocaleString());
      expect(formatting.formatNumber(1000)).toMatch(/K$/);
      expect(formatting.formatNumber(1000 * 1000)).toMatch(/M$/);
    });
  });

  describe('formatFullNumber', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatFullNumber(iceCream)).toEqual(iceCream);
    });

    it('should format floats', () => {
      expect(formatting.formatFullNumber(23456.78)).toEqual('23,456.78');
    });

    it('should format numbers', () => {
      expect(formatting.formatFullNumber(23456)).toEqual('23,456');
    });
  });

  describe('formatMilliseconds', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatMilliseconds(iceCream)).toBe(iceCream);
    });
    it('should include suffixes where appropriate', () => {
      expect(formatting.formatMilliseconds(999)).toMatch(/ms$/);
      expect(formatting.formatMilliseconds(1000)).toMatch(/s$/);
      expect(formatting.formatMilliseconds(60000)).toMatch(/m$/);
    });
  });

  describe('formatBytes', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatBytes(iceCream)).toBe(iceCream);
    });
    it('should include suffixes where appropriate', () => {
      expect(formatting.formatBytes(999)).toMatch(/B$/);
      expect(formatting.formatBytes(1000)).toMatch(/KB$/);
      expect(formatting.formatBytes(1000 * 1000)).toMatch(/MB$/);
      expect(formatting.formatBytes(1000 * 1000)).toMatch(/MB$/);
      expect(formatting.formatBytes(1000 * 1000 * 1000)).toMatch(/GB$/);
      expect(formatting.formatBytes(1000 * 1000 * 1000 * 1000)).toMatch(/TB$/);
      expect(formatting.formatBytes(1000 * 1000 * 1000 * 1000 * 1000)).toMatch(/PB$/);
    });
  });

  describe('formatPercent', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatPercent(iceCream)).toBe(iceCream);
    });

    it('should put a % on the end', () => expect(formatting.formatPercent(27.4)).toMatch(/%$/));
    it('should round percentages nicely', () => expect(formatting.formatPercent(27.436)).toEqual('27.44%'));
    it('should be nice about small percentages', () => expect(formatting.formatPercent(0.001)).toMatch(/<\s+0.01%$/));
  });
});
