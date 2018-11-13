import React from 'react';

// Link to download a static file
// SEE: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download
export default function DownloadLink({ children, component: Component = 'a', ...rest }) {
  return <Component download referrerPolicy='origin' {...rest}>{children}</Component>;
}
