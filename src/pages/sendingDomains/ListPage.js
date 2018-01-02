import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { list as listDomains } from 'src/actions/sendingDomains';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { Loading, TableCollection, SubaccountTag, StatusTag, ApiErrorBanner } from 'src/components';
import { Page, Tooltip, Icon, UnstyledLink } from '@sparkpost/matchbox';
import ReadyFor from './components/ReadyFor';
import UnverifiedWarningBanner from './components/UnverifiedWarningBanner';
import { resolveStatus, resolveReadyFor } from 'src/helpers/domains';

import styles from './ListPage.module.scss';

const tooltipContent = 'Domains can be ready for sending (From), sending with DKIM signing, and bounce (Return Path) usage.';

export class ListPage extends Component {
  componentDidMount() {
    this.props.listDomains();
  }

  getColumns = () => {
    const { hasSubaccounts } = this.props;

    const tooltip = <Tooltip content={tooltipContent}>Status <Icon name='Help' size={15} className={styles.StatusTooltip}/></Tooltip>;

    const columns = [
      { label: 'Domain', width: '30%' },
      { label: tooltip, width: '40%' }
    ];

    if (hasSubaccounts) {
      columns.push({ label: 'Subaccount', width: '20%' });
    }

    return columns;
  }

  getStatusCell = ({ status, is_default_bounce_domain }) => {
    const domainStatus = resolveStatus(status);

    if (domainStatus !== 'verified') {
      return <StatusTag status={domainStatus} />;
    }

    return <ReadyFor {...resolveReadyFor(status)} bounceDefault={is_default_bounce_domain} />;
  }

  getRowData = (row) => {
    const { hasSubaccounts } = this.props;
    const { domain, shared_with_subaccounts, subaccount_id } = row;

    const rowData = [
      <UnstyledLink Component={Link} to={`/account/sending-domains/${domain}/edit`}>{domain}</UnstyledLink>,
      this.getStatusCell(row)
    ];

    if (hasSubaccounts) {
      const subaccountCol = subaccount_id || shared_with_subaccounts
        ? <SubaccountTag all={shared_with_subaccounts} id={subaccount_id} />
        : null;

      rowData.push(subaccountCol);
    }

    return rowData;
  }

  renderCollection() {
    return (
      <TableCollection
        columns={this.getColumns()}
        getRowData={this.getRowData}
        pagination={true}
        rows={this.props.domains}
        filterBox={{
          show: true,
          itemToStringKeys: ['domain'],
          exampleModifiers: ['domain', 'subaccount_id']
        }}
      />
    );
  }

  renderError() {
    return (
      <ApiErrorBanner
        errorDetails={this.props.error.message}
        message="Sorry, we seem to have had some trouble loading your domains."
        reload={this.props.listDomains}
      />
    );
  }

  render() {
    const { error, loading, domains } = this.props;

    if (loading) {
      return <Loading />;
    }

    const primaryAction = {
      content: 'Add a Domain',
      Component: Link,
      to: '/account/sending-domains/create'
    };

    return (
      <Page
        title='Sending Domains'
        primaryAction={primaryAction}
        empty={{
          show: domains.length === 0,
          title: 'Manage Your Domains',
          content: <p>Create and configure your sending and bounce domains.</p>,
          image: 'Setup',
          secondaryAction: {
            content: 'Learn more',
            to: 'https://www.sparkpost.com/docs/getting-started/setting-up-domains/',
            external: true
          }
        }}>
        {domains.length && !error && <UnverifiedWarningBanner />}
        {error ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  hasSubaccounts: hasSubaccounts(state),
  error: state.sendingDomains.error,
  loading: state.sendingDomains.listLoading,
  domains: state.sendingDomains.list
});

export default connect(mapStateToProps, { listDomains })(ListPage);
