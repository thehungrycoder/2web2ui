import React from 'react';
import { Link } from 'react-router-dom';

export function transformLink(element, children) {
  const { href, ...props } = element;

  if (href.startsWith('http')) {
    return <a href={href} target='_blank' {...props}>{children}</a>;
  } else {
    return <Link to={href} {...props}>{children}</Link>;
  }
}

/**
 * Wraps a component that has been loaded via the mdx-loader in webpack
 * See documentation: https://github.com/jamesknelson/mdx-loader
 * Factories documentation: https://github.com/jamesknelson/mdxc#factories
 */
export default ({ component: Component, factories = {}, ...props }) => (
  <Component
    factories={{
      a: transformLink,
      ...factories
    }}
    {...props}
  />
);
