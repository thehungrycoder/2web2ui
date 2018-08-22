import React from 'react';

import { PageLink } from 'src/components';

const VariantsContent = () => (
  <div>
    <p>The templates you've selected will appear here, along with their results once this test concludes.</p>
    <p>If you need to create a new template, <PageLink to='/templates'>head over to the templates page</PageLink>.</p>
  </div>
);

export default VariantsContent;
