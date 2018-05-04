import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Panel, Button } from '@sparkpost/matchbox';
import { TableCollection, DomainStatusCell, StatusTooltipHeader } from 'src/components';
import { selectSendingDomainsForSubaccount } from 'src/selectors/sendingDomains';
import PanelLoading from 'src/components/panelLoading/PanelLoading';

const columns = [
  { label: 'Domain', width: '30%', sortKey: 'domain' },
  { label: <StatusTooltipHeader />, width: '40%' }
];

export const getRowData = (row) => [
  <Link to={`/account/sending-domains/edit/${row.domain}`}>{row.domain}</Link>,
  <DomainStatusCell domain={row} />
];

export class SendingDomainsTab extends Component {
  renderCollection() {
    const { domains } = this.props;
    return (
      <div>
        <Panel.Section>
          <p>Sending Domains assigned to this subaccount.</p>
        </Panel.Section>
        <TableCollection
          columns={columns}
          getRowData={getRowData}
          pagination={true}
          rows={domains}
        />
      </div>
    );
  }

  renderEmpty() {
    return (
      <Panel.Section style={{ textAlign: 'center' }}>
        <p>This subaccount has no sending domains assigned to it. You can assign an existing one, or create a new one.</p>
        <Button plain color='orange' Component={Link} to='/account/sending-domains'>Manage Sending Domains</Button>
      </Panel.Section>
    );
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    const showEmpty = this.props.domains.length === 0;

    return (
      <Panel>
        { showEmpty
          ? this.renderEmpty()
          : this.renderCollection()
        }
      </Panel>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.sendingDomains.listLoading,
  domains: selectSendingDomainsForSubaccount(state, props)
});

export default withRouter(connect(mapStateToProps)(SendingDomainsTab));
