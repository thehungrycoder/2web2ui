import { filteringModel, paginatingModel, fullModel } from '../static';
import { mkRows } from '../../__testHelpers__/rows';

function baseModelTests(modelFn) {
  const rows = mkRows(10);

  it('should return a filter function', () => {
    expect(modelFn(rows)).toBeInstanceOf(Function);
  });

  it('should return a view', () => {
    expect(modelFn(rows)()).toEqual(expect.objectContaining({
      rows: expect.any(Array),
      rowCount: expect.any(Number)
    }));
  });

  it('should operate on rows', () => {
    expect(modelFn(rows)().rows).toEqual(rows);
  });
}

describe('Helper: Static collection row model', () => {
  let rows;
  let model;

  beforeEach(() => {
    rows = mkRows(10);
  });

  describe('Filtering model', () => {
    beforeEach(() => {
      model = filteringModel(rows);
    });

    baseModelTests(filteringModel, rows);

    it('should filter', () => {
      const result = model({ pattern: '2' });
      expect(result.rows).toHaveLength(1);
      expect(result.rowCount).toEqual(1);
    });
  });

  describe('Paginating model', () => {
    beforeEach(() => {
      model = paginatingModel(rows);
    });

    baseModelTests(paginatingModel, rows);

    it('should paginate', () => {
      const result = model({ currentPage: 2, perPage: 2 });
      expect(result.rows).toEqual(rows.slice(2, 4)); // start -> end (exclusive)
      expect(result.rowCount).toEqual(10);
    });

    it('should return the last page', () => {
      expect(model({ currentPage: 3, perPage: 4 })).toEqual({
        rows: rows.slice(8, 11),
        rowCount: rows.length
      });
    });

    it('should return no rows past the last page', () => {
      expect(model({ currentPage: 10, perPage: 10 })).toEqual({
        rows: [],
        rowCount: rows.length
      });
    });
  });

  describe('Full model', () => {
    beforeEach(() => {
      model = fullModel(rows);
    });

    baseModelTests(fullModel, rows);

    it('should paginate and filter', () => {
      // 6 items contain '1' - row-name-*-1 and row-name-i/5-*
      const result = model({ pattern: 'name:1', currentPage: 2, perPage: 2 });
      expect(result.rowCount).toEqual(6);
      expect(result.rows).toHaveLength(2);
    });
  });
});
