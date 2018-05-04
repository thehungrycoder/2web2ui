import React from 'react';
import { Button } from '@sparkpost/matchbox';
import { FileDownload } from '@sparkpost/matchbox-icons';

export const downloadCodes = (codes) => {
  const codesb64 = btoa(codes.join('\n'));
  return `data:text/plain;base64,${codesb64}`;
};

const DownloadCodes = ({ codes }) => (
  <Button download={'sparkpost-backup-codes.txt'} to={downloadCodes(codes)}><FileDownload size={14}/>Download</Button>
);

export default DownloadCodes;
