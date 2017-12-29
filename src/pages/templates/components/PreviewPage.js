import React from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, TextField } from '@sparkpost/matchbox';

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

  const { email, name } = template.content.from;

  return (
    <Page {...pageProps}>
      <Panel sectioned>
        <TextField required label="To" placeholder="example@domain.com, example@domain.com, ..." />
        <TextField disabled label="From" value={name ? `${name} <${email}>` : email} />
        <TextField disabled label="Subject" value={template.content.subject} />
        <PreviewPanel html={template.content.html} text={template.content.text} />
      </Panel>
    </Page>
  );
}
