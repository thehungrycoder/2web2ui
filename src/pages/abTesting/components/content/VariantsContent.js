import React from 'react';

import { PageLink } from 'src/components';

const VariantsContent = ({ formValues }) => (
  <div>
    <p>The templates you've selected will appear here, along with their results once this test concludes.</p>
    {
      formValues.audience_selection === 'percent' && <p>Total percentage value for all variants must equal 100%.</p>
    }
    <p>If you need to create a new template, <PageLink to='/templates'>head over to the templates page</PageLink>.</p>
  </div>
);

VariantsContent.defaultProps = {
  formValues: {}
};

export default VariantsContent;
