import React from 'react';
import { EmptyState } from '@sparkpost/matchbox';
import { Generic } from 'src/components/images';

export default function PageNotFound() {
  return <EmptyState
    title='Page Not Found'
    image={Generic}>
    <p>We cannot find what you're looking for, use the navigation to find your way.</p>
  </EmptyState>;
}
