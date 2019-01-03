import { changeSummaryTable } from '../summaryTables';

describe('Summary Table Action Creators', () => {
  describe('.changeSummaryTable', () => {
    it('combines table name and values for payload', () => {
      const action = changeSummaryTable('testTable', { page: 1 });

      expect(action).toMatchSnapshot();
    });
  });
});
