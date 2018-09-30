import React from 'react';
import { Button } from '@sparkpost/matchbox';
import Papa from 'papaparse';
import _ from 'lodash';

function formatToCsv(rows) {
  // we are doing this because certain keys are objects/array which papa parse doesn't stringify
  const mappedRows = _.map(rows, (row) => _.mapValues(row, (value) => _.isObject(value) || _.isArray(value) ? JSON.stringify(value) : value));
  const data = Papa.unparse(mappedRows);
  return `data:text/csv;charset=utf-8,${encodeURI(data)}`;
}

const SaveCsv = ({ rows }) => {
  const now = Math.floor(Date.now() / 1000);
  return <Button download={`sparkpost-csv-${now}.csv`} to={formatToCsv(rows)}>Save As CSV</Button>;
};

export default SaveCsv;
