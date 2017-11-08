import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Route, Switch } from 'react-router-dom';
import { Page, Tabs } from '@sparkpost/matchbox';
import _ from 'lodash';

import { getSubaccount } from 'src/actions/subaccounts';
import { getSubaccount as getSubaccountSelector } from 'src/selectors/subaccounts';
import { listPools } from 'src/actions/ipPools';
import { listApiKeys } from 'src/actions/api-keys';

import ApiKeysTab from './components/ApiKeysTab';
import EditTab from './components/EditTab';
import PanelLoading from './components/PanelLoading';

const breadcrumbAction = {
  content: 'Subaccounts',
  Component: Link,
  to: '/account/subaccounts'
};

const tabs = [
  {
    content: 'Settings',
    Component: Link,
    to: ''
  },
  {
    content: 'API Keys',
    Component: Link,
    to: ''
  }
];

export class DetailsPage extends Component {

  constructor(props) {
    super(props);

    const { id } = props;
    tabs[0].to = `/account/subaccounts/${id}`;
    tabs[1].to = `/account/subaccounts/${id}/api-keys`;
  }

  componentDidMount() {
    this.props.getSubaccount(this.props.id);
    this.props.listPools();
    this.props.listApiKeys();
  }

  render() {
    const { loading, location } = this.props;
    const selectedTab = _.endsWith(location.pathname, 'keys') ? 1 : 0;

    if (loading) {
      return (
        <Page title={'loading...'} breadcrumbAction={breadcrumbAction} >
          <Tabs
            selected={selectedTab}
            tabs={tabs}
          />
          <PanelLoading />
        </Page>
      );
    }
    const { match, subaccount } = this.props;

    return (
      <Page title={`${subaccount.name}`} breadcrumbAction={breadcrumbAction}>
        <Tabs
          selected={selectedTab}
          tabs={tabs}
        />
        <Switch>
          <Route exact path={match.url} render={() => <EditTab subaccount={subaccount} />} />
          <Route path={`${match.url}/api-keys`} render={() => <ApiKeysTab id={subaccount.id}/>} />
        </Switch>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { subaccounts } = state;
  return {
    id: props.match.params.id,
    loading: subaccounts.getLoading,
    subaccount: getSubaccountSelector(state)
  };
};

export default withRouter(
  connect(mapStateToProps, { getSubaccount, listPools, listApiKeys })(DetailsPage)
);
