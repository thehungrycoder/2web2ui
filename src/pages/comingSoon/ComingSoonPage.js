import React from 'react';

import { EmptyState } from '@sparkpost/matchbox';
import { Generic } from 'src/components/images';

export default function ComingSoonPage() {
  return <EmptyState
    title='We are not quite finished in here.'
    image={Generic}>
    <p>We won't bother putting up blinking construction stripes but you get the idea. <span role='img' aria-label='smile'>&#x1F603;</span></p>
  </EmptyState>;
}
