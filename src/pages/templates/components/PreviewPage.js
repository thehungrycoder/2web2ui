import React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';

import { Loading } from 'src/components';
import PreviewPanel from './PreviewPanel';

export default function PreviewPage({ editTemplatePath, label, template }) {
  if (!template) {
    return <Loading />;
  }

  const pageProps = {
    breadcrumbAction: {
      Component: Link,
      content: 'Edit Template',
      to: editTemplatePath
    },
    title: `${template.name} (${label})`
  };

  return (
    <Page {...pageProps}>
      <PreviewPanel {...template.content} />
    </Page>
  );
}
