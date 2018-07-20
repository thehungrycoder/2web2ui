import React, { Fragment } from 'react';
import _ from 'lodash';
import { Page, Tag, UnstyledLink, ActionList, Popover, Select, Panel, Button, Label, TextField } from '@sparkpost/matchbox';
import { ExpandMore } from '@sparkpost/matchbox-icons';
import { LabelledValue } from 'src/components'
import DatePicker from 'src/components/datePicker/DatePicker';
import StatusTag from './StatusTag';

import { formatDateTime } from 'src/helpers/date';

const VersionSelector = ({ version }) => {

  if (version > 1) {
    const actions = _.times(version, (i) => ({ content: `View Version ${i + 1}`, visible: i + 1 !== version })).reverse();
    return (
      <Popover left trigger={<React.Fragment>Version {version} <ExpandMore/></React.Fragment>}>
        <ActionList actions={actions}/>
      </Popover>
    )
  }

  return null;
}

export const StatusPanel = ({ test }) => (
  <Panel>
    <Panel.Section actions={[
      { content: <VersionSelector version={test.version} />, color: 'orange' }
    ]}>
      <LabelledValue label='Status'>
        <StatusTag status={test.status} />
      </LabelledValue>
      <LabelledValue label='Test ID' value={test.id} />
    </Panel.Section>
  </Panel>
);

export const StatusDatesPanel = ({ test }) => {
  const isNotEditable = test.status === 'running' || test.status === 'cancelled' || test.status === 'completed';

  if (isNotEditable) {
    return (
      <Panel sectioned>
        <LabelledValue label='Start Date' ><p>{formatDateTime(test.start_time)}</p></LabelledValue>
        <LabelledValue label='End Date' ><p>{formatDateTime(test.end_time)}</p></LabelledValue>
      </Panel>
    )
  }

  return (
    <React.Fragment>
      <Panel sectioned>
        <TextField label='Test Name' defaultValue={test.name} helpText='Internal use only' />
      </Panel>
      <Panel sectioned>
        <Label label='When should we run this test?'/>
        <DatePicker
          left helpText='A test may run for a maximum of 30 days'/>
      </Panel>
    </React.Fragment>
  );
}
