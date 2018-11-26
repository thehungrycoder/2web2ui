import React from 'react';
import { Page, Panel, Select, Tooltip, UnstyledLink } from '@sparkpost/matchbox';
import { ArrowDropDown, ArrowDropUp, InfoOutline, Wifi } from '@sparkpost/matchbox-icons';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { TableCollection } from 'src/components/collection';
import styles from './OverviewPage.module.scss';

import HealthScorePanel from './components/HealthScorePanel';
import SpamTrapPanel from './components/SpamTrapPanel';

const OverviewPage = () => (
  <Page
    // This an abuse of title
    // Need a way to place a subtitle of filters
    title={(
      <React.Fragment>
        <Wifi color="orange" size={40} /> Signals
        <span className={styles.Divider}> | </span>
        <div className={styles.SubaccountSelect}>
          <Select
            options={[{ label: 'All subaccounts', value: ' ' }]}
            selectedValue=" "
          />
        </div>
      </React.Fragment>
    )}

    // This is abuse of primaryAction
    primaryAction={{
      Component: () => (
        <div className={styles.Filters}>
          {/* Can't easily style and include field label in selected value */}
          <div className={styles.Facet}>
            <Select
              options={[{ label: 'Sending Domain', value: ' ' }]}
              selectedValue=" "
            />
          </div>
          <div className={styles.DateRange}>
            <Select
              options={[{ label: 'Last 14 days', value: ' ' }]}
              selectedValue=" "
            />
          </div>
        </div>
      ),
      content: 'Hi',
      to: '/' // temporary
    }}
  >
    <HealthScorePanel />
    <SpamTrapPanel />
  </Page>
);

export default OverviewPage;
