import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';
import { Loading, ApiErrorBanner } from 'src/components';
import TrackingDomainsCollection from './components/TrackingDomainsCollection';

import { listTrackingDomains } from 'src/actions/trackingDomains';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { hasSubaccounts } from 'src/selectors/subaccounts';

const primaryAction = {
  content: 'Create Tracking Domain',
  Component: Link,
  to: '/account/tracking-domains/create'
};

export class ListPage extends Component {
  componentDidMount() {
    this.props.listTrackingDomains();
    this.props.listSubaccounts();
  }

  onReloadApiBanner = () => {
    this.props.listTrackingDomains({ force: true }); // force a refresh
  };

  renderError() {
    return (
      <ApiErrorBanner
        error={this.props.error}
        reload={this.onReloadApiBanner}
      />
    );
  }

  render() {
    const { error, loading, trackingDomains, hasSubaccounts } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title='Tracking Domains'
        primaryAction={primaryAction}
        empty={{
          test: trackingDomains.length === 0,
          content: <p>Track your email engagement events</p>,
          image: 'Generic'
        }}>
        { error ? this.renderError() : <TrackingDomainsCollection rows={trackingDomains} hasSubaccounts={hasSubaccounts}/> }
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { trackingDomains } = state;
  return {
    error: trackingDomains.error,
    loading: trackingDomains.listLoading,
    trackingDomains: trackingDomains.list,
    hasSubaccounts: hasSubaccounts(state)
  };
};

export default connect(mapStateToProps, { listTrackingDomains, listSubaccounts })(ListPage);
