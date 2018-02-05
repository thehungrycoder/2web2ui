import React from 'react';

import { Panel } from '@sparkpost/matchbox';

import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';

const ShareWithSubaccounts = ({ domain, onChange }) => {
  // If the subaccount_id is set on the domain object, this is a
  // subaccount domain so it cannot be shared with all other subaccounts.
  // https://developers.sparkpost.com/api/sending-domains.html
  if ('subaccount_id' in domain) {
    return null;
  }

  return <Panel.Section>
    <ToggleBlock
      input={{ name: 'shareWithSubaccounts' }}
      label='Share this domain with all subaccounts?'
      checked={domain.shared_with_subaccounts}
      onChange={onChange}
    />
  </Panel.Section>;
};

export default ShareWithSubaccounts;
