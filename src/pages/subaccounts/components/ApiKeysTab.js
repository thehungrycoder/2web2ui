import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Panel, Button } from '@sparkpost/matchbox';
import { TableCollection } from 'src/components';
import { filterBoxConfig } from 'src/pages/api-keys/tableConfig';
import { getSubaccountApiKeys } from 'src/selectors/api-keys';

const columns = [
  { label: 'Name', width: '40%' },
  { label: 'Key', width: '20%' }
];


export const getRowData = ({ id, label, short_key }) => [
  <Link to={`/account/api-keys/details/${id}`}>{label}</Link>,
  <code>{short_key}••••••••</code>
];

export class ApiKeysTab extends Component {

  renderCollection(keys) {
    return (
      <TableCollection
        columns={columns}
        getRowData={getRowData}
        pagination={true}
        rows={keys}
        filterBox={filterBoxConfig}
      />
    );
  }

  renderEmpty() {
    return (
      <Panel.Section>
        <p>This subaccount will need an API Key in order to send email</p>
        <Button default to="/account/api-keys/create">Create</Button>
      </Panel.Section>
    );
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return null;
    }

    const { keys } = this.props;
    const count = !!keys.length;

    return (
      <Panel>
        { !count && this.renderEmpty() }
        { this.renderCollection(keys) }
      </Panel>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.apiKeys.loading,
  keys: getSubaccountApiKeys(state, props)
});

export default withRouter(connect(mapStateToProps, { })(ApiKeysTab));
