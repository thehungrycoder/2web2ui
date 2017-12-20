import * as formatting from '../formatting';

describe('Formatting helpers', () => {
  describe('roundToPlaces', () => {
    it('should round to specified decimal places', () => {
      expect(formatting.roundToPlaces(2.116, 2)).toBeCloseTo(2.12);
    });
  });

  describe('formatNumber', () => {
    it('should include suffixes where appropriate', () => {
      expect(formatting.formatNumber(999)).toEqual((999).toLocaleString());
      expect(formatting.formatNumber(1000)).toMatch(/K$/);
      expect(formatting.formatNumber(1000 * 1000)).toMatch(/M$/);
      expect(formatting.formatNumber(1000 * 1000 * 1000)).toMatch(/^\d+(\.\d+)?e[-+]\d+$/);
    });
  });

  describe('formatMilliseconds', () => {
    it('should include suffixes where appropriate', () => {
      expect(formatting.formatMilliseconds(999)).toMatch(/ms$/);
      expect(formatting.formatMilliseconds(1000)).toMatch(/s$/);
      expect(formatting.formatMilliseconds(60000)).toMatch(/min$/);
    });
  });

  describe('formatBytes', () => {
    it('should include suffixes where appropriate', () => {
      expect(formatting.formatBytes(999)).toMatch(/B$/);
      expect(formatting.formatBytes(1000)).toMatch(/KB$/);
      expect(formatting.formatBytes(1000 * 1000)).toMatch(/MB$/);
      expect(formatting.formatBytes(1000 * 1000)).toMatch(/MB$/);
      expect(formatting.formatBytes(1000 * 1000 * 1000)).toMatch(/GB$/);
      expect(formatting.formatBytes(1000 * 1000 * 1000 * 1000)).toMatch(/TB$/);
    });
  });
});
