import { changeSummaryTable, resetSummaryTable } from '../summaryTables';

describe('Summary Table Action Creators', () => {
  describe('.changeSummaryTable', () => {
    it('combines table name and values for payload', () => {
      const action = changeSummaryTable('testTable', { page: 1 });
      expect(action).toMatchSnapshot();
    });
  });

  describe('.resetSummaryTable', () => {
    it('passes on name and default values for payload', () => {
      const action = resetSummaryTable('testTable', { order: { ascending: true, dataKey: 'id' }});
      expect(action).toMatchSnapshot();
    });
  });
});
