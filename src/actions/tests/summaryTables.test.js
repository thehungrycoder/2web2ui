import { changeSummaryTable, resetSummaryTable } from '../summaryTables';

describe('Summary Table Action Creators', () => {
  describe('.changeSummaryTable', () => {
    it('combines table name and values for payload', () => {
      const action = changeSummaryTable('testTable', { page: 1 });
      expect(action).toMatchSnapshot();
    });
  });

  describe('.resetSummaryTable', () => {
    it('passes on name for payload', () => {
      const action = resetSummaryTable('testTable');
      expect(action).toMatchSnapshot();
    });
  });
});
