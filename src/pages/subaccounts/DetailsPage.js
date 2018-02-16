import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Route, Switch } from 'react-router-dom';
import { Page, Tabs } from '@sparkpost/matchbox';

import { getSubaccount } from 'src/actions/subaccounts';
import { ApiKeySuccessBanner } from 'src/components';
import { selectSubaccount } from 'src/selectors/subaccounts';
import { listPools } from 'src/actions/ipPools';
import { listApiKeys, hideNewApiKey } from 'src/actions/api-keys';
import { list as listDomains } from 'src/actions/sendingDomains';

import ApiKeysTab from './components/ApiKeysTab';
import EditTab from './components/EditTab';
import SendingDomainsTab from './components/SendingDomainsTab';
import PanelLoading from 'src/components/panelLoading/PanelLoading';

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

  // only want to show the new key after a create
  componentWillUnmount() {
    this.props.hideNewApiKey();
  }

  componentDidMount() {
    this.props.getSubaccount(this.props.id);
    this.props.listPools();
    this.props.listApiKeys();
    this.props.listDomains();
  }

  renderApiKeyBanner() {
    return (
      <ApiKeySuccessBanner
        title="Don't Forget Your API Key"
      />
    );
  }

  render() {
    const { loading, location, id } = this.props;
    const tabs = buildTabs(id);
    const selectedTab = tabs.findIndex(({ to }) => location.pathname === to);

    if (loading) {
      return (
        <Page title={'loading...'} breadcrumbAction={breadcrumbAction} >
          <Tabs selected={selectedTab} tabs={tabs} />
          <PanelLoading />
        </Page>
      );
    }

    const { match, subaccount, newKey } = this.props;

    return (
      <Page title={`${subaccount.name} (${subaccount.id})`} breadcrumbAction={breadcrumbAction}>
        { newKey && this.renderApiKeyBanner() }
        <Tabs selected={selectedTab} tabs={tabs} />
        <Switch>
          <Route exact path={match.url} render={() => <EditTab subaccount={subaccount} />} />
          <Route path={`${match.url}/api-keys`} render={() => <ApiKeysTab id={subaccount.id}/>} />
          <Route path={`${match.url}/sending-domains`} render={() => <SendingDomainsTab id={subaccount.id}/>} />
        </Switch>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { subaccounts, apiKeys } = state;
  return {
    id: props.match.params.id,
    loading: subaccounts.getLoading,
    subaccount: selectSubaccount(state),
    newKey: apiKeys.newKey
  };
};

export default withRouter(
  connect(mapStateToProps, { getSubaccount, listPools, listApiKeys, hideNewApiKey, listDomains })(DetailsPage)
);
