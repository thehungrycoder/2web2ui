import React from 'react';
import { Page } from '@sparkpost/matchbox';
import ApiErrorBanner from 'src/components/apiErrorBanner';
import { Templates } from 'src/components/images';
import Loading from 'src/components/loading';
import PageLink from 'src/components/pageLink';
import { DeleteModal } from 'src/components';
import SnippetCollection from './components/SnippetCollection';

export default class ListPage extends React.Component {

  state = {
    showDeleteModal: false,
    snippetToDelete: {}
  }

  componentDidMount() {
    this.props.getSnippets();
  }

  toggleDelete = (id, subaccount_id) => {
    this.setState({
      showDeleteModal: !this.state.showDeleteModal,
      snippetToDelete: { id, subaccountId: subaccount_id }
    });
  }

  handleDelete = () => {
    const { id, subaccountId } = this.state.snippetToDelete;

    return this.props.deleteSnippet({ id, subaccountId }).then(() => {
      this.props.showAlert({ type: 'success', message: 'Snippet deleted' });
      this.toggleDelete();
    });
  }

  renderError() {
    const { error, getSnippets } = this.props;
    return (
      <ApiErrorBanner
        errorDetails={error.message}
        message="Sorry, we seem to have had some trouble loading your snippets."
        reload={getSnippets}
      />
    );
  }

  renderCollection() {
    const { snippets, hasSubaccounts } = this.props;
    return (
      <SnippetCollection
        snippets={snippets}
        toggleDelete={this.toggleDelete}
        hasSubaccounts={hasSubaccounts}
      />
    );
  }

  render() {
    const { canCreate, error, loading, snippets, deletePending } = this.props;

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
        {error ? this.renderError() : this.renderCollection()}
        <DeleteModal
          open={this.state.showDeleteModal}
          title='Are you sure you want to delete this snippet?'
          content={<p>The snippet will be immediately and permanently removed. This cannot be undone.</p>}
          onDelete={this.handleDelete}
          onCancel={this.toggleDelete}
          isPending={deletePending}
        />
      </Page>
    );
  }
}
