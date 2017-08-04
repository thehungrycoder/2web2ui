import React from 'react';

const RequestBlock = ({ testRequest, testSent, targetURL }) => {
  const requestText = `The test sends the following request to this webhook's target URL (${targetURL}):`;

  return (
    <div>
      <p>
        {requestText}
      </p>
      <pre>
        <code>
          <textarea readOnly value={testRequest} rows={10} cols={100}/>
        </code>
      </pre>
    </div>
  );
};

export default RequestBlock;
