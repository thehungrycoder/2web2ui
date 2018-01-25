import React from 'react';

import { Panel, Grid, Toggle } from '@sparkpost/matchbox';

import styles from './DomainStatus.module.scss';

const ShareWithSubaccounts = ({ domain, onChange }) => {
  // If the subaccount_id is set on the domain object, this is a
  // subaccount domain so it cannot be shared with all other subaccounts.
  // https://developers.sparkpost.com/api/sending-domains.html
  if ('subaccount_id' in domain) {
    return null;
  }

  return <Panel.Section>
    <Grid>
      <Grid.Column xs={12} md={8}>
        <label className={styles.ShareLabel} htmlFor='shareWithSubaccounts'>Share this domain with subaccounts?</label>
      </Grid.Column>
      <Grid.Column xs={12} md={4}>
        <div className={styles.Toggle}>
          <Toggle
            id='shareWithSubaccounts'
            checked={domain.shared_with_subaccounts}
            onChange={onChange}
          />
        </div>
      </Grid.Column>
    </Grid>
  </Panel.Section>;
};

export default ShareWithSubaccounts;
