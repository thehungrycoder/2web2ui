import React from 'react';
import { TextField } from '@sparkpost/matchbox';

const RequestBlock = ({ testRequest, targetURL }) => (
  <div>
    <p>The test sends the following request to this webhook's target URL ({targetURL})</p>
    <code><TextField multiline readOnly value={testRequest} rows={6} resize='vertical' /></code>
  </div>
);

export default RequestBlock;
