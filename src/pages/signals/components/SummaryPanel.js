import React from 'react';
import { Panel } from '@sparkpost/matchbox';
import SummaryTable, { Column } from 'src/components/summaryTable';

const data = [
  { sending_domain: 'a.com', current: '999', percentage: '99' },
  { sending_domain: 'b.com', current: '999', percentage: '99' },
  { sending_domain: 'c.com', current: '999', percentage: '99' },
  { sending_domain: 'd.com', current: '999', percentage: '99' },
  { sending_domain: 'e.com', current: '999', percentage: '99' },
  { sending_domain: 'f.com', current: '999', percentage: '99' },
  { sending_domain: 'g.com', current: '999', percentage: '99' },
  { sending_domain: 'h.com', current: '999', percentage: '99' },
  { sending_domain: 'i.com', current: '999', percentage: '99' },
  { sending_domain: 'j.com', current: '999', percentage: '99' },
  { sending_domain: 'k.com', current: '999', percentage: '99' },
  { sending_domain: 'l.com', current: '999', percentage: '99' },
  { sending_domain: 'm.com', current: '999', percentage: '99' },
  { sending_domain: 'n.com', current: '999', percentage: '99' },
  { sending_domain: 'o.com', current: '999', percentage: '99' },
  { sending_domain: 'p.com', current: '999', percentage: '99' },
  { sending_domain: 'q.com', current: '999', percentage: '99' },
  { sending_domain: 'r.com', current: '999', percentage: '99' },
  { sending_domain: 's.com', current: '999', percentage: '99' },
  { sending_domain: 't.com', current: '999', percentage: '99' },
  { sending_domain: 'u.com', current: '999', percentage: '99' },
  { sending_domain: 'v.com', current: '999', percentage: '99' },
  { sending_domain: 'w.com', current: '999', percentage: '99' },
  { sending_domain: 'x.com', current: '999', percentage: '99' },
  { sending_domain: 'y.com', current: '999', percentage: '99' },
  { sending_domain: 'z.com', current: '999', percentage: '99' }
];

const SummaryPanel = ({ title }) => (
  <Panel>
    <Panel.Section>
      <h5>{title}</h5>
    </Panel.Section>
    <SummaryTable
      data={data}
      tableName={title}
      totalCount={data.length}
    >
      <Column
        dataKey="sending_domain"
        label="Sending Domains"
        width="75%"
      />
      <Column
        dataKey="current"
        label="Current"
        sortable
      />
      <Column
        dataKey="percentage"
        label="Percentage"
        component={({ percentage }) => `${percentage}%`}
      />
    </SummaryTable>
  </Panel>
);

export default SummaryPanel;
