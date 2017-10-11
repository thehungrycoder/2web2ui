import React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';

const primaryAction = {
  content: 'Create Recipient List',
  Component: Link,
  to: '/account/recipient-lists/create'
};

const RecipientListsListHeader = () => (
  <Page title='Recipient Lists' primaryAction={primaryAction}/>
);

export default RecipientListsListHeader;
