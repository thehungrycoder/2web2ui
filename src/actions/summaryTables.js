export const changeSummaryTable = (tableName, values) => ({
  type: 'CHANGE_SUMMARY_TABLE',
  payload: {
    ...values,
    tableName
  }
});
