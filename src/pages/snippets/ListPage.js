import React from 'react';
import { Page } from '@sparkpost/matchbox';
import ApiErrorBanner from 'src/components/apiErrorBanner';
import { Templates } from 'src/components/images';
import { TableCollection } from 'src/components/collection';
import Loading from 'src/components/loading';
import PageLink from 'src/components/pageLink';
import ActionsTableData from './components/ActionsTableData';
import NameTableData from './components/NameTableData';
import SubaccountTableData from './components/SubaccountTableData';
import UpdatedAtTableData from './components/UpdatedAtTableData';

export default class ListPage extends React.Component {
  componentDidMount() {
    this.props.getSnippets();
  }

  Row = (data) => {
    if (this.props.hasSubaccounts) {
      return [
        <NameTableData {...data} />,
        <SubaccountTableData {...data} />,
        <UpdatedAtTableData {...data} />,
        <ActionsTableData {...data} />
      ];
    }

    return [
      <NameTableData {...data} />,
      <UpdatedAtTableData {...data} />,
      <ActionsTableData {...data} />
    ];
  }

  render() {
    const { canCreate, error, getSnippets, hasSubaccounts, loading, snippets } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title="Snippets"
        primaryAction={(
          canCreate
            ? { Component: PageLink, content: 'Create Snippet', to: '/snippets/create' }
            : undefined
        )}
        empty={{
          show: snippets.length === 0,
          image: Templates,
          title: 'Manage your template snippets',
          content: <p>Build, import, edit, and reuse snippets.</p>
        }}
      >
        {error ? (
          <ApiErrorBanner
            errorDetails={error.message}
            message="Sorry, we seem to have had some trouble loading your snippets."
            reload={getSnippets}
          />
        ) : (
          <TableCollection
            columns={(
              hasSubaccounts
                ? [HEADERS.name, HEADERS.subaccount, HEADERS.updateAt, HEADERS.actions]
                : [HEADERS.name, HEADERS.updateAt, HEADERS.actions]
            )}
            defaultSortColumn={HEADERS.name.sortKey}
            filterBox={{
              show: true,
              exampleModifiers: ['id', 'name'],
              itemToStringKeys: ['name', 'id', 'subaccount_id']
            }}
            getRowData={this.Row}
            rows={snippets}
            pagination
          />
        )}
      </Page>
    );
  }
}

const HEADERS = {
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
};
