import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { list as listDomains } from 'src/actions/sendingDomains';
import { Loading, TableCollection, SubaccountTag, StatusTag } from 'src/components';

import { Page, Button, Tag } from '@sparkpost/matchbox';

import { resolveStatus, resolveReadyFor } from 'src/helpers/domains';
import { snakeToFriendly } from 'src/helpers/string';

import _ from 'lodash';

// import styles from './ListPage.module.scss';

class ListPage extends Component {
  componentDidMount() {
    this.props.listDomains();
  }

  renderCollection() {
    const columns = [
      { label: 'Domain', width: '30%' },
      { label: 'Ready For', width: '40%' },
      { label: 'Subaccount', width: '20%' },
      null
    ];

    const getRowData = (row) => {
      const { domain, is_default_bounce_domain, shared_with_subaccounts, subaccount_id } = row;
      const sub = '';

      const statusCell = () => {
        const readyFor = resolveReadyFor(row.status);
        const status = resolveStatus(row.status);

        if (status !== 'verified') {
          return <StatusTag unverified={status === 'unverified'} blocked={status === 'blocked'} pending={status === 'pending'}/>;
        }
        // className={styles.Red}
        // className={styles.Status}
        return (
          <span>
            <small>Ready For:</small>
            { _.keys(readyFor).map((key) => {
              if (key === 'bounce' && readyFor[key] && is_default_bounce_domain) {
                return <Tag orange key={key}>Bounce (Default)</Tag>;
              }
              return readyFor[key] ? <Tag key={key}>{snakeToFriendly(key)}</Tag> : null;
            })}
          </span>
        );
      };

      const subaccount = subaccount_id || shared_with_subaccounts
        ? <SubaccountTag all={shared_with_subaccounts} id={subaccount_id} master={subaccount_id === 0}/>
        : null;

      return [
        <Fragment>{ domain }</Fragment>,
        <Fragment>{ statusCell() }</Fragment>,
        <Fragment>{subaccount}</Fragment>,
        <Button disabled size='small'>View Details</Button>
      ];
    };

    return (
      <TableCollection
        columns={columns}
        getRowData={getRowData}
        pagination={true}
        rows={this.props.domains}
        filterBox={{ show: false }}
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
        title='Domains'
        primaryAction={primaryAction}
        empty={{
          show: domains.length === 0,
          title: 'Manage Your Domains',
          image: 'Users',
          secondaryAction: {
            content: 'Learn more',
            to: 'https://developers.sparkpost.com/api/subaccounts.html',
            external: true
          }
        }}>
        { error ? 'error' : this.renderCollection() }
      </Page>
    );
  }
}

const mapStateToProps = ({ sendingDomains }) => ({
  error: sendingDomains.error,
  loading: sendingDomains.listLoading,
  domains: sendingDomains.list
});

export default connect(mapStateToProps, { listDomains })(ListPage);
