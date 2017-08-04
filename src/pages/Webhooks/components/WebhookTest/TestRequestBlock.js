import React from 'react';

const RequestBlock = (props) => {
  const { testRequest } = props;

  return (
    <div>
      <p>
        The following request will be sent to your webhook target URL:
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
