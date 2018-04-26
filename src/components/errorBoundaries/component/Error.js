import React from 'react';
import { EmptyState } from '@sparkpost/matchbox';

export default (props) => {
  const { message, primaryAction } = props;

  return <EmptyState
    title='Sorry, something went wrong'
    image='Generic'
    primaryAction={primaryAction}
    {...props}
  >
    <p>{message || 'Our engineers are notified and working on fixing this issue.'}</p>
  </EmptyState>;
};
