import React from 'react';
import { Link } from 'react-router-dom';

export default ({ component: Component, factories = {}, ...props }) => (
  <Component
    factories={{
      a: ({ href, ...props }, children) => {
        if (href.startsWith('http')) {
          return <a href={href} target='_blank' {...props}>{children}</a>;
        } else {
          return <Link to={href} {...props}>{children}</Link>;
        }
      },
      ...factories
    }}
    {...props}
  />
);
