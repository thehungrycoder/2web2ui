import React from 'react';
import { Button, Icon } from '@sparkpost/matchbox';

export const downloadCodes = (codes) => {
  const codesb64 = btoa(codes.join('\n'));
  return `data:text/plain;base64,${codesb64}`;
};

const DownloadCodes = ({ codes }) => (
  <Button download={'sparkpost-backup-codes.txt'} to={downloadCodes(codes)}><Icon name='Download' size={14}/>Download</Button>
);

export default DownloadCodes;
