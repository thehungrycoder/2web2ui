import React from 'react';
import { Button } from '@sparkpost/matchbox';
import print from 'print-js';

export const printCodes = (codes) => {
  const formattedCodes = codes.map((code) => ({ code }));
  print({ printable: formattedCodes, properties: ['code'], type: 'json' });
};

const PrintCodes = ({ codes }) => (
  <Button onClick={() => printCodes(codes)}>Print</Button>
);

export default PrintCodes;
