import { Button } from '@sparkpost/matchbox';
import React from 'react';
import _ from 'lodash';
import Papa from 'papaparse';

const formatToCsv = (rows) => {
  // we are doing this because certain keys are objects/array which papa parse doesn't stringify
  const mappedRows = _.map(rows, (row) => _.mapValues(row, (value) => _.isObject(value) || _.isArray(value) ? JSON.stringify(value) : value));
  const data = Papa.unparse(mappedRows);
  return `data:text/csv;charset=utf-8,${encodeURIComponent(data)}`;
};

const SaveCSVButton = ({ data, saveCsv }) => {
  const now = Math.floor(Date.now() / 1000);

  if (!saveCsv || !data) {
    return null;
  }

  return <Button download={`sparkpost-csv-${now}.csv`} to={formatToCsv(data)}>Save As CSV</Button>;
};

export default SaveCSVButton;
