import React from 'react';
import BackupCodesList from './BackupCodesList';
import DownloadCodes from './DownloadCodes';
import CopyCodes from './CopyCodes';
import PrintCodes from './PrintCodes';

const BackupCodes = ({ codes }) => (
  <div>
    <p><strong>Your shiny new backup codes:</strong></p>
    <BackupCodesList codes={codes} />
    <DownloadCodes codes={codes} />
    <CopyCodes codes={codes} />
    <PrintCodes codes={codes} />
  </div>
);

export default BackupCodes;
