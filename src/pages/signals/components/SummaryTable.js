import React from 'react';
import { Panel } from '@sparkpost/matchbox';

const SummaryTable = ({ title }) => (
  <Panel>
    <Panel.Section>
      <h5>{title}</h5>
    </Panel.Section>
  </Panel>
);

export default SummaryTable;
