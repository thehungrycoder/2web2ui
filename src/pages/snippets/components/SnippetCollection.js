import React, { Component } from 'react';

// Components
import { TableCollection } from 'src/components';
import ActionsTableData from './ActionsTableData';
import NameTableData from './NameTableData';
import SubaccountTableData from './SubaccountTableData';
import UpdatedAtTableData from './UpdatedAtTableData';

const filterBoxConfig = {
  show: true,
  exampleModifiers: ['id', 'name'],
  itemToStringKeys: ['name', 'id', 'subaccount_id']
};

export class SnippetCollection extends Component {

  getColumns() {
    const { HEADERS } = this;

    const columns = this.props.hasSubaccounts
      ? [HEADERS.name, HEADERS.subaccount, HEADERS.updateAt, HEADERS.actions]
      : [HEADERS.name, HEADERS.updateAt, HEADERS.actions];

    return columns;
  }

  getRowData = (data) => {
    const actionsData = { ...data, toggleDelete: this.props.toggleDelete };

    if (this.props.hasSubaccounts) {
      return [
        <NameTableData {...data} />,
        <SubaccountTableData {...data} />,
        <UpdatedAtTableData {...data} />,
        <ActionsTableData {...actionsData} />
      ];
    }

    return [
      <NameTableData {...data} />,
      <UpdatedAtTableData {...data} />,
      <ActionsTableData {...actionsData} />
    ];
  }

  render() {
    const { snippets } = this.props;
    return (
      <TableCollection
        columns={this.getColumns()}
        rows={snippets}
        getRowData={this.getRowData}
        defaultSortColumn={this.HEADERS.name.sortKey}
        filterBox={filterBoxConfig}
        pagination
      />
    );
  }

  HEADERS = {
    actions: null, // placeholder for the column
    name: {
      label: 'Name',
      sortKey: ({ id, name }) => (name || id).toLowerCase() // name may not be present
    },
    subaccount: {
      label: 'Subaccount',
      sortKey: ({ subaccount_id, shared_with_subaccounts }) => (
        subaccount_id || shared_with_subaccounts
      )
    },
    updateAt: {
      label: 'Last Updated',
      sortKey: ({ created_at, updated_at }) => updated_at || created_at
    }
  }
}

export default SnippetCollection;
