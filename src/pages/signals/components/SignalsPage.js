import React from 'react';
import { Page } from '@sparkpost/matchbox';
import { getFriendlyTitle } from 'src/helpers/signals';

const SignalsPage = ({ dimensionPrefix, facet, facetId, title = 'Signals', ...props }) => (
  <Page
    {...props}
    title={title}
    subtitle={getFriendlyTitle({ prefix: dimensionPrefix, facet, facetId })}
  />
);


export default SignalsPage;
