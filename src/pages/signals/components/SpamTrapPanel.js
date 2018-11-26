import React from 'react';
import { Page, Panel, Select, Tooltip, UnstyledLink } from '@sparkpost/matchbox';
import { ArrowDropDown, ArrowDropUp, InfoOutline, Wifi } from '@sparkpost/matchbox-icons';
import * as Recharts from 'recharts';
import { TableCollection } from 'src/components/collection';
import styles from './SpamTrapPanel.module.scss';

import spamTrapHits from '../data/spamTrapHits';

const SpamTrapPanel = () => (
  <div className={styles.SpamTrapHits}>
    <Panel
      title={(
        <React.Fragment>
          Spam Trap Summary {
            <Tooltip
              content={(
                <React.Fragment>
                  <strong>Spam Trap</strong> is a predictive indicator of potential issues that
                  could negatively impact your reputation ... For more details on this composite
                  score please <UnstyledLink>check out the knowledge base.</UnstyledLink>
                </React.Fragment>
              )}
            >
              <InfoOutline />
            </Tooltip>
          }
        </React.Fragment>
      )}
    >
      <Recharts.ResponsiveContainer height={300} width="100%">
        <Recharts.BarChart data={spamTrapHits(5)} layout="horizontal">
          <Recharts.Bar dataKey="value" />
        </Recharts.BarChart>
      </Recharts.ResponsiveContainer>
    </Panel>
  </div>
);

export default SpamTrapPanel;
