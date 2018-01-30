import React from 'react';
import { TextField, Panel } from '@sparkpost/matchbox';

const ResponseBlock = ({ testSent, testResponse }) => {
  const success = testResponse && testResponse.status <= 299;

  return (
    <div>
      { testSent && success &&
        <Panel.Section>
          <p>The server responded like this:</p>
          <code><TextField multiline readOnly value={JSON.stringify(testResponse, null, '  ')} rows={12} /></code>
        </Panel.Section>
      }
    </div>
  );
};

export default ResponseBlock;
