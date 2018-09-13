import React from 'react';
import { UnstyledLink } from '@sparkpost/matchbox';
import { OpenInNew } from '@sparkpost/matchbox-icons';

export default function ExternalLink({ children, ...props }) {
  return (
    <UnstyledLink
      {...props}
      external
    >
      {children} <OpenInNew size={13} />
    </UnstyledLink>
  );
}
