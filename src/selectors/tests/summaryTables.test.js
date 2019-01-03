import { selectSummaryTable } from 'src/selectors/summaryTables';

describe('Summary Tables Selectors', () => {
  describe('.selectSummaryTable', () => {
    const state = {
      summaryTables: {
        testTable: {
          currentPage: 9
        }
      }
    };

    it('returns default state', () => {
      expect(selectSummaryTable(state)).toMatchSnapshot();
    });

    it('returns a tables state', () => {
      const tableState = selectSummaryTable(state, 'testTable');
      expect(tableState).toEqual({ currentPage: 9 });
    });
  });
});
