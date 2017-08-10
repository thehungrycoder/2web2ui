import React from 'react';

import { Banner } from '@sparkpost/matchbox';

const ResponseBanner = ({ responseStatus, success }) => {
  const bannerStatus = success ? 'success' : 'danger';
  const bannerText = success ? 'The test was successful!'
    : `The test failed: POST to webhook target URL failed with non-2xx response code ${responseStatus}`;

  return <Banner status={bannerStatus}>{bannerText}</Banner>;
};

const ResponseBlock = ({ testSent, testResponse }) => {
  const success = testResponse && testResponse.status <= 299;

  return (
    <div>
      { testSent && testResponse && <ResponseBanner success={success} responseStatus={testResponse.status}/>}
      { testSent && success &&
        <div>
          The server responded like this:
          <pre>
            <code>
              <textarea readOnly value={JSON.stringify(testResponse, null, '  ')} rows={10} cols={100}/>
            </code>
          </pre>
        </div> }
    </div>
  );
};

export default ResponseBlock;
