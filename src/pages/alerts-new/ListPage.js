import React from 'react';
import { Page } from '@sparkpost/matchbox';
import withAlertsList from './containers/ListPageContainer';

const ListPage = () => (
  <Page title='Alerts'>

  </Page>
);

export default withAlertsList(ListPage);
