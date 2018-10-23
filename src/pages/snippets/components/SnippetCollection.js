import React, { Component } from 'react';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { formatDateTime } from 'src/helpers/date';

// Components
import PageLink from 'src/components/pageLink';
import ActionPopover from 'src/components/actionPopover';
import { NameCell, TableCollection } from 'src/components';
import SubaccountTag from 'src/components/tags/SubaccountTag';

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
    const { CELLS } = this;

    if (this.props.hasSubaccounts) {
      return [
        <CELLS.Name {...data} />,
        <CELLS.Subaccount {...data} />,
        <CELLS.UpdatedAt {...data} />,
        <CELLS.Actions {...data} />
      ];
    }

    return [
      <CELLS.Name {...data} />,
      <CELLS.UpdatedAt {...data} />,
      <CELLS.Actions {...data} />
    ];
  }

  render() {
    const { snippets } = this.props;
    return (
      <TableCollection
        columns={this.getColumns()}
        rows={snippets}
        getRowData={this.getRowData}
        defaultSortColumn="name"
        filterBox={filterBoxConfig}
        pagination
      />
    );
  }

  HEADERS = {
    actions: null, // placeholder for the column
    name: {
      label: 'Name',
      sortKey: ({ id, name }) => name || id // name may not be present
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

  CELLS = {
    Actions: ({ id, subaccount_id }) => (
      <ActionPopover
        actions={[
          {
            Component: PageLink,
            content: 'Edit',
            to: `/snippets/edit/${id}${setSubaccountQuery(subaccount_id)}`,
            section: 1
          },
          {
            content: 'Delete',
            section: 2,
            onClick: () => this.props.toggleDelete(id, subaccount_id)
          }
        ]}
      />
    ),
    Name: ({ id, name, subaccount_id }) => (
      <NameCell
        id={id}
        name={name}
        to={`/snippets/edit/${id}${setSubaccountQuery(subaccount_id)}`}
      />
    ),
    Subaccount: ({ shared_with_subaccounts, subaccount_id }) => {
      if (!shared_with_subaccounts && !subaccount_id) {
        return null;
      }
      return <SubaccountTag all={shared_with_subaccounts} id={subaccount_id} />;
    },
    UpdatedAt: ({ created_at, updated_at }) => (
      // on initial creation of a snippet, updated_at is not present
      formatDateTime(updated_at || created_at)
    )
  }
}

export default SnippetCollection;
