import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Panel, Button } from '@sparkpost/matchbox';
import { TableCollection } from 'src/components';
import { filterBoxConfig } from 'src/pages/api-keys/tableConfig';
import { getSubaccountApiKeys } from 'src/selectors/api-keys';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

const columns = [
  { label: 'Name', width: '40%', sortKey: 'label' },
  { label: 'Key', width: '20%' }
];


export class ApiKeysTab extends Component {

  renderCollection(keys) {
    return (
      <div>
        <Panel.Section>
          <p>API Keys assigned to this subaccount.</p>
        </Panel.Section>
        <TableCollection
          columns={columns}
          getRowData={this.getRowData}
          pagination={true}
          rows={keys}
          filterBox={filterBoxConfig}
        />
      </div>
    );
  }

  getRowData = ({ id, label, short_key }) => {
    const subaccountId = this.props.id;

    return [
      <Link to={`/account/api-keys/details/${id}${setSubaccountQuery(subaccountId)}`}>{label}</Link>,
      <code>{short_key}••••••••</code>
    ];
  }

  renderEmpty() {
    return (
      <Panel.Section style={{ textAlign: 'center' }}>
        <p>This subaccount has no API Keys assigned to it. You can assign an existing one, or create a new one.</p>
        <Button plain Component={Link} to='/account/api-keys'>Manage API Keys</Button>
      </Panel.Section>
    );
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    const { keys } = this.props;
    const showEmpty = keys.length === 0;

    return (
      <Panel>
        { showEmpty
          ? this.renderEmpty()
          : this.renderCollection(keys)
        }
      </Panel>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.apiKeys.keysLoading,
  keys: getSubaccountApiKeys(state, props)
});

export default withRouter(connect(mapStateToProps, { })(ApiKeysTab));
