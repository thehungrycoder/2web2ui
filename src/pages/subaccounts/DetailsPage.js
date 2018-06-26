import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Route, Switch } from 'react-router-dom';
import { Page, Tabs } from '@sparkpost/matchbox';

import { clearSubaccount, getSubaccount } from 'src/actions/subaccounts';
import { ApiKeySuccessBanner } from 'src/components';
import { selectSubaccount } from 'src/selectors/subaccounts';
import { listPools } from 'src/actions/ipPools';
import { listApiKeys, hideNewApiKey } from 'src/actions/api-keys';
import { list as listDomains } from 'src/actions/sendingDomains';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { Loading } from 'src/components/loading/Loading';

import ApiKeysTab from './components/ApiKeysTab';
import EditTab from './components/EditTab';
import SendingDomainsTab from './components/SendingDomainsTab';

const breadcrumbAction = {
  content: 'Subaccounts',
  Component: Link,
  to: '/account/subaccounts'
};


const buildTabs = (id) => [
  {
    content: 'Details',
    Component: Link,
    to: `/account/subaccounts/${id}`
  },
  {
    content: 'API Keys',
    Component: Link,
    to: `/account/subaccounts/${id}/api-keys`
  },
  {
    content: 'Sending Domains',
    Component: Link,
    to: `/account/subaccounts/${id}/sending-domains`
  }
];

export class DetailsPage extends Component {
  componentDidMount() {
    this.props.getSubaccount(this.props.id);
    this.props.listPools();
    this.props.listApiKeys();
    this.props.listDomains();
  }

  // only want to show the new key after a create
  componentWillUnmount() {
    this.props.clearSubaccount();
    this.props.hideNewApiKey();
  }

  render() {
    const { error, id, loading, location, newKey, subaccount } = this.props;
    const tabs = buildTabs(id);
    const selectedTab = tabs.findIndex(({ to }) => location.pathname === to);

    if (error) {
      return (
        <RedirectAndAlert
          to="/account/subaccounts"
          alert={{ type: 'warning', message: `Unable to find subaccount for ${id}` }}
        />
      );
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <Page title={`${subaccount.name} (${subaccount.id})`} breadcrumbAction={breadcrumbAction}>
        {newKey && <ApiKeySuccessBanner title="Don't Forget Your API Key" />}
        <Tabs selected={selectedTab} tabs={tabs} />
        <Switch>
          <Route exact path="/account/subaccounts/:id" render={() => <EditTab subaccount={subaccount} />} />
          <Route exact path="/account/subaccounts/:id/api-keys" render={() => <ApiKeysTab id={subaccount.id} />} />
          <Route exact path="/account/subaccounts/:id/sending-domains" render={() => <SendingDomainsTab id={subaccount.id} />} />
        </Switch>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({
  error: state.subaccounts.getError,
  id: props.match.params.id,
  loading: state.subaccounts.getLoading,
  subaccount: selectSubaccount(state),
  newKey: state.apiKeys.newKey
});

const mapDispatchToProps = {
  clearSubaccount,
  getSubaccount,
  hideNewApiKey,
  listApiKeys,
  listDomains,
  listPools
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailsPage));
