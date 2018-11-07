import React, { Component } from 'react';
import { TableCollection } from 'src/components/collection';
import ActionsTableData from './ActionsTableData';
import DeleteSnippetModal from './DeleteSnippetModal.container';
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
      component: ActionsTableData,
      header: null,
      visible: () => this.props.canCreate
    }
  ]

  renderRow = (columns, parentProps) => (props) => (
    columns.map(({ component: Component }) => <Component {...parentProps} {...props} />)
  )

  render() {
    const { snippets } = this.props;
    const visibleColumns = this.columns.filter(({ visible = () => true }) => visible());

    return (
      <DeleteSnippetModal>
        {({ open: openDeleteModal }) => (
          <TableCollection
            columns={visibleColumns.map(({ header }) => header)}
            rows={snippets}
            getRowData={this.renderRow(visibleColumns, { openDeleteModal })}
            defaultSortColumn={this.columns[0].header.sortKey}
            filterBox={filterBoxConfig}
            pagination
          />
        )}
      </DeleteSnippetModal>
    );
  }
}
