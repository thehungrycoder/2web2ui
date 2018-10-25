import React from 'react';
import ExternalLink from 'src/components/externalLink/ExternalLink';
import { LINKS } from 'src/constants';

const IdentifierHelpText = () => (
  <React.Fragment>
    Use this unique identifier to {(
      <ExternalLink to={LINKS.SNIPPET_SUBSTITUTION_REFERENCE}>
        reference your snippet in a template
      </ExternalLink>
    )}
  </React.Fragment>
);

export default IdentifierHelpText;
