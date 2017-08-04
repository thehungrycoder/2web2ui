import React from 'react';

const RequestBlock = (props) => {
  const { testRequest, targetURL } = props;

  return (
    <div>
      <p>
        The following request will be sent to this webhook's target URL ({targetURL}):
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
