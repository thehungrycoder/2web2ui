export const changeSummaryTable = (tableName, values) => ({
  type: 'CHANGE_SUMMARY_TABLE',
  payload: {
    ...values,
    tableName
  }
});

export const resetSummaryTable = (tableName) => ({
  type: 'RESET_SUMMARY_TABLE',
  payload: {
    tableName
  }
});
