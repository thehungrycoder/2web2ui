import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { getLatestAbTest } from 'src/actions/abTesting';
import { selectLatestVersionNumber } from 'src/selectors/abTesting';
import { LabelledValue, SubaccountTag } from 'src/components';
import { ActionList, Popover, Panel } from '@sparkpost/matchbox';
import { ExpandMore } from '@sparkpost/matchbox-icons';
import StatusTag from './StatusTag';

import _ from 'lodash';

const VersionSelector = ({ current, latest, id, subaccountId }) => {
  if (latest > 1) {

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
  }

  return null;
};

class StatusPanel extends Component {
  static defaultProps = {
    latest: 0
  }

  componentDidMount() {
    const { test, subaccountId, getLatestAbTest } = this.props;
    getLatestAbTest({ id: test.id, subaccountId });
  }

  render() {
    const { test, subaccountId, latest } = this.props;
    let panelActions = null;

    if (latest > 1) {
      panelActions = [{ content: <VersionSelector current={test.version} id={test.id} latest={latest} subaccountId={subaccountId} />, color: 'orange' }];
    }

    return (
      <Panel>
        <Panel.Section actions={panelActions}>
          <LabelledValue label='Status'>
            <StatusTag status={test.status} />
          </LabelledValue>
          <LabelledValue label='Test ID' value={test.id} />
          {subaccountId && <LabelledValue label='Subaccount'><SubaccountTag id={subaccountId} /></LabelledValue>}
        </Panel.Section>
      </Panel>
    );
  }
}

const mapStateToProps = (state, props) => ({
  latest: selectLatestVersionNumber(state, props)
});
export default withRouter(connect(mapStateToProps, { getLatestAbTest })(StatusPanel));
