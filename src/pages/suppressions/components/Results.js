import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Button } from '@sparkpost/matchbox';

import { PanelLoading, TableCollection, Empty } from 'src/components';

import { formatSubaccountDisplay } from '../helpers';
import { Detail } from './Detail';


export class Results extends Component {
  state = {
    modal: {
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

  toggleModal = (row) => {
    const { modal } = this.state;

    this.setState({
      modal: {
        open: !modal.open,
        data: row
      }
    });
  }

  hideModal = () => {
    this.setState({
      modal: {
        open: false,
        data: null
      }
    });
  }

  getRowData = (row) => {
    const { recipient, type, source, subaccount_id: subaccountId } = row;
    const { subaccounts: allSubaccounts, hasSubaccounts } = this.props;
    const rowData = [recipient,
      type === 'transactional' ? 'Transactional' : 'Non-transactional',
      source
    ];

    if (hasSubaccounts) {
      rowData.push(formatSubaccountDisplay(parseInt(subaccountId, 10), allSubaccounts));
    }

    rowData.push(
      <div style={{ textAlign: 'right' }}>
        {/* <Detail suppression={row} /> */}
        <Button size='small' onClick={() => this.toggleModal(row)}>View detail</Button> &nbsp;
        <Button destructive size='small'>Delete</Button>
      </div>
    );

    return rowData;
  };

  getColumns() {
    const { hasSubaccounts } = this.props;

    const columns = [
      { label: 'Recipient' },
      { label: 'Type', width: '18%' },
      { label: 'Source', width: '20%' }
    ];

    if (hasSubaccounts) {
      columns.push({ label: 'Subaccount', width: '18%' });
    }

    columns.push({ label: '', width: '15%' });

    return columns;
  }

  renderModalView = () => {
    const { modal } = this.state;
    const { open, data } = modal;

    if (!data) {
      return null;
    }

    return (
      <Detail suppression={data} open={open} onCancel={this.hideModal} />
    );
  }

  renderResults = () => {
    const { results } = this.props;
    return (
      <div>
        { this.renderModalView() }

        <TableCollection
          columns={this.getColumns()}
          rows={results}
          getRowData={this.getRowData}
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

export default connect(null)(Results);
