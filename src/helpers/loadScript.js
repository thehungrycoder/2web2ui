import React from 'react';
import Script from 'react-load-script';

function loadScript({ url, ...rest }) {
  return <Script url={url} {...rest} />;
}

export {
  loadScript
};
