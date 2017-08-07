import React from 'react';

import Layout from '../../../components/Layout/Layout';
import { Page, Panel } from '@sparkpost/matchbox';

const WebhooksLoading = ({ title, ...rest }) => (
  <Layout.App>
    <Page
      title={title}
      {...rest}
    />
    <Panel>
      <Panel.Section>
        Loading...
      </Panel.Section>
    </Panel>
  </Layout.App>
);

export default WebhooksLoading;
