import React from 'react';

import { UnstyledLink } from '@sparkpost/matchbox';

const VariantsContent = () => (
  <div>
    <p>The templates you've selected will appear here, along with their results once this test concludes.</p>
    <p>If you need to create a new template, <UnstyledLink to='/templates'>head over to the templates page</UnstyledLink>.</p>
  </div>
);

export default VariantsContent;
