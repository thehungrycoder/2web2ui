import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { selectLatestVersionNumberFromParams, selectIdAndVersionFromParams } from 'src/selectors/abTesting';
import { LabelledValue, SubaccountTag } from 'src/components';
import { ActionList, Popover, Panel } from '@sparkpost/matchbox';
import { ExpandMore } from '@sparkpost/matchbox-icons';
import StatusTag from './StatusTag';

import _ from 'lodash';

const VersionSelector = ({ current, latest, id, subaccountId }) => {
  const actions = _.times(latest, (i) => ({
    content: `View Version ${i + 1}`,
    to: `/ab-testing/${id}/${i + 1}${setSubaccountQuery(subaccountId)}`,
    component: Link,
    visible: i + 1 !== current
  })).reverse();

  return (
    <Popover left trigger={<Fragment>Version <span>{current}</span> <ExpandMore/></Fragment>}>
      <ActionList actions={actions}/>
    </Popover>
  );
};

export const StatusPanel = ({ test, version, id, subaccountId, latest }) => {
  let panelActions = null;

  if (latest > 1) {
    panelActions = [{ content: <VersionSelector current={version} id={id} latest={latest} subaccountId={subaccountId} />, color: 'orange' }];
  }

  return (
    <Panel>
      <Panel.Section actions={panelActions}>
        <LabelledValue label='Status'>
          <StatusTag status={test.status} />
        </LabelledValue>
        <LabelledValue label='Test ID' value={id} />
        {!!subaccountId && <LabelledValue label='Subaccount'><SubaccountTag id={subaccountId} /></LabelledValue>}
      </Panel.Section>
    </Panel>
  );
};

StatusPanel.displayName = 'StatusPanel';

const mapStateToProps = (state, props) => ({
  latest: selectLatestVersionNumberFromParams(state, props),
  ...selectIdAndVersionFromParams(state, props)
});
export default withRouter(connect(mapStateToProps, {})(StatusPanel));
