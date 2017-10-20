import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';
import { Loading, ApiErrorBanner } from 'src/components';

import TrackingDomainsCollection from './components/TrackingDomainsCollection';
import TrackingDomainsEmptyState from './components/TrackingDomainsEmptyState';

import { listTrackingDomains } from 'src/actions/trackingDomains';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { hasSubaccounts } from 'src/selectors/subaccounts';


export class ListPage extends Component {
  componentDidMount() {
    this.props.listTrackingDomains();
    this.props.listSubaccounts();
  }

  onReloadApiBanner = () => {
    this.props.listTrackingDomains({ force: true }); // force a refresh
  };

  renderError(error) {
    const primaryAction = {
      content: 'Create Tracking Domain',
      Component: Link,
      to: '/account/tracking-domains/create'
    };

    return (
      <div>
        <Page title='Tracking Domains' primaryAction={primaryAction}/>
        <ApiErrorBanner
          error={error}
          reload={this.onReloadApiBanner}
        />
      </div>
    );
  }

  render() {
    const { error, loading, trackingDomains, hasSubaccounts } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <div>
        { error
          ? this.renderError(error)
          : trackingDomains.length
            ? <TrackingDomainsCollection rows={trackingDomains} hasSubaccounts={hasSubaccounts}/>
            : <TrackingDomainsEmptyState />
        }
      </div>
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
