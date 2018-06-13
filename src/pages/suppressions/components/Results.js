/* eslint max-lines: ["error", 200] */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SubaccountTag } from 'src/components';
import { Button } from '@sparkpost/matchbox';
import { PanelLoading, TableCollection, Empty, DeleteModal } from 'src/components';
import { deleteSuppression } from 'src/actions/suppressions';
import { showAlert } from 'src/actions/globalAlert';
import Detail from './Detail';


export class Results extends Component {
  state = {
    detail: { // detail modal
      open: false,
      data: null
    },
    del: { // delete confirmation modal
      open: false,
      data: {}
    }
  }

  renderPlaceholder() {
    return (
      <Empty message='Choose some options to see your suppressions' />
    );
  }

  renderEmpty() {
    return (
      <Empty message='There are no results for your current query' />
    );
  }

  getRowData = (row) => {
    const { recipient, type, source, subaccount_id: subaccountId } = row;
    const { subaccounts: allSubaccounts, hasSubaccounts } = this.props;
    const rowData = [recipient,
      type === 'transactional' ? 'Transactional' : 'Non-transactional',
      source
    ];

    if (hasSubaccounts) {
      rowData.push(<SubaccountTag id={subaccountId}/>);
    }

    rowData.push(
      <div style={{ textAlign: 'right' }}>
        <Button.Group>
          <Button size='small' onClick={() => this.toggleDetailModal(row)}>View Details</Button>
          <Button destructive size='small' onClick={() => this.toggleDeleteModal(row)}>Delete</Button>
        </Button.Group>
      </div>
    );

    return rowData;
  };

  getColumns() {
    const { hasSubaccounts } = this.props;

    const columns = [
      { label: 'Recipient', sortKey: 'recipient' },
      { label: 'Type', sortKey: 'type', width: '18%' },
      { label: 'Source', width: '20%', sortKey: 'source' }
    ];

    if (hasSubaccounts) {
      columns.push({ label: 'Subaccount', width: '18%', sortKey: (row) => parseInt(row.subaccount_id, 10) });
    }

    columns.push({ label: '', width: '21%' });

    return columns;
  }

  toggleDetailModal = (row) => {
    const { detail } = this.state;

    this.setState({
      detail: {
        open: !detail.open,
        data: row
      }
    });
  }

  renderDetailModal = () => {
    const { open, data } = this.state.detail;
    const { subaccounts, hasSubaccounts } = this.props;

    return (
      <Detail suppression={data} open={open} onCancel={this.toggleDetailModal} subaccounts={subaccounts} hasSubaccounts={hasSubaccounts} />
    );
  }

  deleteSuppression = () => {
    const { showAlert, deleteSuppression } = this.props;
    const { data } = this.state.del;

    return deleteSuppression(data)
      .then(() => {
        this.toggleDeleteModal();
        return showAlert({ type: 'success', message: `${data.recipient} was successfully deleted from the suppression list` });
      });
  }

  toggleDeleteModal = (row) => {
    const { del } = this.state;
    const open = !del.open;
    const data = open ? row : {};

    this.setState({
      del: { open, data }
    });
  }

  renderDeleteModal = () => {
    const { open, data } = this.state.del;
    const { deleting } = this.props;

    return (<DeleteModal
      open={open}
      title={`Are you sure you want to delete ${data.recipient} from suppression list?`}
      content={<p>This can not be undone!</p>}
      isPending={deleting}
      onConfirm={this.deleteSuppression}
      onCancel={this.toggleDeleteModal}
    />);
  }

  renderResults = () => {
    const { results } = this.props;

    return (
      <div>
        {this.renderDeleteModal()}
        {this.renderDetailModal()}

        <TableCollection
          columns={this.getColumns()}
          rows={results}
          getRowData={this.getRowData}
          defaultSortColumn='recipient'
          pagination
        />
      </div>
    );
  }

  render() {
    const { results = [], loading } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    if (results === null) {
      return this.renderPlaceholder();
    }

    return results.length ? this.renderResults() : this.renderEmpty();
  }
}

export default connect(null, { deleteSuppression, showAlert })(Results);
