import React, { Component } from 'react';
import { connect } from 'react-redux';

import Layout from 'src/components/layout/Layout';
import ApiErrorBanner from 'src/components/apiErrorBanner/ApiErrorBanner';
import TrackingDomainsCollection from './components/TrackingDomainsCollection';
import TrackingDomainsListHeader from './components/TrackingDomainsListHeader';
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

  renderError({ payload, meta }) {
    return (
      <div>
        <TrackingDomainsListHeader />
        <ApiErrorBanner
          errorDetails={payload.message}
          action={meta.method}
          resource='tracking domains'
          reload={this.onReloadApiBanner}
        />
      </div>
    );
  }

  render() {
    const { error, loading, trackingDomains, hasSubaccounts } = this.props;

    return (
      <Layout.App loading={loading}>
        { error
          ? this.renderError(error)
          : trackingDomains.length
            ? <TrackingDomainsCollection rows={trackingDomains} hasSubaccounts={hasSubaccounts}/>
            : <TrackingDomainsEmptyState />
        }
      </Layout.App>
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
