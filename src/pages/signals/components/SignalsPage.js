import React from 'react';
import { Page } from '@sparkpost/matchbox';
import { OpenInNew } from '@sparkpost/matchbox-icons';
import { getFriendlyTitle } from 'src/helpers/signals';

const SignalsPage = ({ dimensionPrefix, facet, facetId, title = 'Signals', ...props }) => (
  <Page
    {...props}
    title={title}
    secondaryActions={[{
      content: (
        <span>
          Learn more about Signals <OpenInNew size={13} style={{ marginTop: '-0.18em' }}/>
        </span>
      ),
      external: true,
      to: 'https://www.sparkpost.com/docs/signals/overview/'
    }]}
    subtitle={getFriendlyTitle({ prefix: dimensionPrefix, facet, facetId })}
  />
);


export default SignalsPage;
