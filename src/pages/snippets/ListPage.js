import React from 'react';
import { Page } from '@sparkpost/matchbox';
import ApiErrorBanner from 'src/components/apiErrorBanner';
import { Templates } from 'src/components/images';
import { NameCell, TableCollection } from 'src/components/collection';
import Loading from 'src/components/loading';
import PageLink from 'src/components/pageLink';
import SubaccountTag from 'src/components/tags/SubaccountTag';
import { formatDateTime } from 'src/helpers/date';


export const Name = ({ id, name }) => (
  <NameCell id={id} name={name} to={`/snippets/edit/${id}`} />
);

export const Subaccount = ({ shared_with_subaccounts, subaccount_id }) => {
  if (!shared_with_subaccounts && !subaccount_id) {
    return null;
  }

  return <SubaccountTag all={shared_with_subaccounts} id={subaccount_id} />;
};

// on initial creation of a snippet, updated_at is not present
export const UpdatedAt = ({ created_at, updated_at }) => (
  formatDateTime(updated_at || created_at)
);


export default class ListPage extends React.Component {
  componentDidMount() {
    this.props.getSnippets();
  }

  Row = (data) => {
    if (this.props.hasSubaccounts) {
      return [<Name {...data} />, <Subaccount {...data} />, <UpdatedAt {...data} />];
    }

    return [<Name {...data} />, <UpdatedAt {...data} />];
  }

  render() {
    const { canCreate, error, getSnippets, hasSubaccounts, loading, snippets } = this.props;
    const nameHeader = { label: 'Name', sortKey: 'name' };
    const subaccountHeader = {
      label: 'Subaccount',
      sortKey: ({ subaccount_id, shared_with_subaccounts }) => [
        subaccount_id,
        shared_with_subaccounts
      ]
    };
    const updateAtHeader = {
      label: 'Last Updated',
      sortKey: ({ created_at, updated_at }) => [updated_at, created_at]
    };

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
                ? [nameHeader, subaccountHeader, updateAtHeader]
                : [nameHeader, updateAtHeader]
            )}
            defaultSortColumn="name"
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
