import React from 'react';
import { EmptyState } from '@sparkpost/matchbox';

const RecipientListsEmptyState = () => (
  <EmptyState
    title="Recipient Lists Empty Title"
    action={{ content: 'Create a Recipient List' }}
    secondaryAction={{ content: 'API Docs', to: 'https://developers.sparkpost.com/api/recipient-lists.html', target: '_blank' }}
  >
    <p>Recipient List Explanation</p>
  </EmptyState>
);

export default RecipientListsEmptyState;
