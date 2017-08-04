import React from 'react';

import { Banner } from '@sparkpost/matchbox';

const ResponseBlock = (props) => {
  const { testResponse } = props;

  const success = testResponse.status && testResponse.status <= 299;

  const banner = success
    ? <Banner status='success'>
      The test was successful!
    </Banner>
    : <Banner status='danger'>
      The test failed (POST to webhook target URL failed with non-2xx response code 404)
    </Banner>;

  return (
    <div>
      { banner }
      { success &&
        <pre>
          <code>
            <textarea readOnly value={JSON.stringify(testResponse, null, '  ')} rows={10} cols={100}/>
          </code>
        </pre> }
    </div>
  );
};

export default ResponseBlock;
