import { DEFAULT } from 'src/reducers/summaryTables';

export const selectSummaryTable = (state, tableName) => state.summaryTables[tableName] || state.summaryTables[DEFAULT];
