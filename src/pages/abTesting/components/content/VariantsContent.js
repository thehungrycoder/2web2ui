import React from 'react';

import { PageLink } from 'src/components';

const VariantsContent = () => (
  <div>
    <p>The templates you've selected will appear here, along with their results once this test concludes. Results will be updated approximately every 15 minutes.</p>
    <p>Selected templates must be published.</p>
    <p>If you need to create a new template, <PageLink to='/templates'>head over to the templates page</PageLink>.</p>
  </div>
);

export default VariantsContent;
