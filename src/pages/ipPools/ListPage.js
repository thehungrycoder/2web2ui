import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Actions
import { listPools } from '../../actions/ipPools';

// Components
import { Layout, TableCollection, ApiErrorBanner } from 'src/components';
import { Page } from '@sparkpost/matchbox';

const columns = ['Name', 'ID', 'Number of IPs Assigned'];
const getRowData = ({ id, name, ips }) => {
  const nameLink = <Link to={'/account/ip-pools'}>{name}</Link>;
  return [nameLink, id, ips.length.toString()];
};

export class IpPoolsList extends Component {

  componentDidMount() {
    this.props.listPools();
  }

  renderError() {
    const { error, listPools } = this.props;
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your ip pools.'}
        errorDetails={error.message}
        reload={listPools}
      />
    );
  }

  renderCollection() {
    const { ipPools } = this.props;
    return (
      <TableCollection
        columns={columns}
        rows={ipPools}
        getRowData={getRowData}
        pagination={true}
      />
    );
  }

  render() {
    const { ipPools, loading, error } = this.props;

    return (
      <Layout.App loading={ipPools.length === 0 && loading}>
        <Page
          primaryAction={{ content: 'Create IP Pool', Component: Link, to: '/account/ip-pools/create' }}
          title={'IP Pools'}
        />
        {error && this.renderError()}
        {!error && this.renderCollection()}
      </Layout.App>
    );
  }
}

function mapStateToProps({ ipPools }) {
  return {
    ipPools: ipPools.list,
    loading: ipPools.listLoading,
    error: ipPools.listError
  };
}

export default connect(mapStateToProps, { listPools })(IpPoolsList);
