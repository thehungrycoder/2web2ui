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

export default class SnippetCollection extends Component {
  columns = [
    {
      component: NameTableData,
      header: {
        label: 'Name',
        sortKey: ({ id, name }) => (name || id).toLowerCase() // name may not be present
      }
    },
    {
      component: SubaccountTableData,
      header: {
        label: 'Subaccount',
        sortKey: ({ subaccount_id, shared_with_subaccounts }) => (
          subaccount_id || shared_with_subaccounts
        )
      },
      visible: () => this.props.hasSubaccounts
    },
    {
      component: UpdatedAtTableData,
      header: {
        label: 'Last Updated',
        sortKey: ({ created_at, updated_at }) => updated_at || created_at
      }
    },
    {
      component: (props) => <ActionsTableData {...props} toggleDelete={this.props.toggleDelete} />,
      header: null,
      visible: () => this.props.canCreate
    }
  ]

  renderRow = (columns) => (props) => (
    columns.map(({ component: Component }) => <Component {...props} />)
  )

  render() {
    const { snippets } = this.props;
    const visibleColumns = this.columns.filter(({ visible = () => true }) => visible());

    return (
      <TableCollection
        columns={visibleColumns.map(({ header }) => header)}
        rows={snippets}
        getRowData={this.renderRow(visibleColumns)}
        defaultSortColumn={this.columns[0].header.sortKey}
        filterBox={filterBoxConfig}
        pagination
      />
    );
  }
}
