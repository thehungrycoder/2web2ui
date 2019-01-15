export const changeSummaryTable = (tableName, values) => ({
  type: 'CHANGE_SUMMARY_TABLE',
  payload: {
    ...values,
    tableName
  }
});

export const resetSummaryTable = (tableName, defaultValues = {}) => ({
  type: 'RESET_SUMMARY_TABLE',
  payload: {
    ...defaultValues,
    tableName
  }
});
