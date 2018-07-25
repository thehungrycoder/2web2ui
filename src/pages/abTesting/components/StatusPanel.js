import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { LabelledValue, SubaccountTag } from 'src/components'
import { ActionList, Popover, Panel } from '@sparkpost/matchbox';
import { ExpandMore } from '@sparkpost/matchbox-icons';
import StatusTag from './StatusTag';

import _ from 'lodash';

const VersionSelector = ({ version, id, subaccount_id }) => {
  //  if (version > 1) {
  //
  //   const actions = _.times(version, (i) => ({
  //     content: `View Version ${i + 1}`,
  //     to: `/ab-testing/${id}/${i + 1}${setSubaccountQuery(subaccount_id)}`,
  //     component: Link,
  //     visible: i + 1 !== version
  //   })).reverse();
  //
  //   return (
  //     <Popover left trigger={<Fragment>Version {version} <ExpandMore/></Fragment>}>
  //       <ActionList actions={actions}/>
  //     </Popover>
  //   )
  // }

  // TODO so this is not usable
  // if viewing anything but the latest, there is no way to know if there are newer versions
  return null;
}

export default ({ test, subaccountId }) => (
  <Panel>
    <Panel.Section actions={[
      { content: <VersionSelector {...test} />, color: 'orange' }
    ]}>
      <LabelledValue label='Status'>
        <StatusTag status={test.status} />
      </LabelledValue>
      <LabelledValue label='Test ID' value={test.id} />
      {subaccountId && <LabelledValue label='Subaccount'><SubaccountTag id={subaccountId} /></LabelledValue>}
    </Panel.Section>
  </Panel>
);
