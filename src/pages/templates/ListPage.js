import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import config from 'src/config';

// Actions
import { listTemplates } from 'src/actions/templates';
import { templatesListSelector, filteredTemplatesSelector } from 'src/selectors/templates';
// Components
import { Layout, TableCollection, ApiErrorBanner } from 'src/components';
import { Page, EmptyState } from '@sparkpost/matchbox';
import Filters from './components/Filters';

const CREATE_ACTION = {
  content: 'Create Template',
  to: '/templates/create',
  Component: Link
};
const columns = ['Name', 'ID', 'Published', 'Updated'];
const getRowData = ({ published, id, name, last_update_time }) => {
  const status = published ? 'published' : 'draft';
  const nameLink = <Link to={`/templates/edit/${id}`}>{name}</Link>;
  return [nameLink, id, status, Date(last_update_time)];
};

class ListPage extends Component {

  componentDidMount() {
    this.props.listTemplates();
  }

  renderError() {
    const { error, listTemplates } = this.props;
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your templates.'}
        errorDetails={error.message}
        reload={listTemplates}
      />
    );
  }

  renderCollection() {
    const { templates } = this.props;
    return (
      <TableCollection
        columns={columns}
        rows={templates}
        getRowData={getRowData}
        pagination
      />
    );
  }

  render() {
    const { count, loading, error } = this.props;

    if (!loading && count === 0) {
      return (
        <Layout.App>
          <EmptyState
            title='Manage your email templates'
            action={CREATE_ACTION} >
            {/* secondaryAction={content: 'Learn More', onClick: Learn_More()} > */}
            <p>Build, test, preview and send your transmissions.</p>
          </EmptyState>
        </Layout.App>
      );
    }

    return (
      <Layout.App loading={loading}>
        <Page
          primaryAction={CREATE_ACTION}
          title={'Templates'}
        />
        {error && this.renderError()}
        {!error && count > config.filters.minCount && <Filters />}
        {!error && count > 0 && this.renderCollection()}
      </Layout.App>
    );
  }
}

function mapStateToProps(state) {
  return {
    count: templatesListSelector(state).length,
    templates: filteredTemplatesSelector(state),
    loading: state.templates.listLoading,
    error: state.templates.listError
  };
}

export default withRouter(connect(mapStateToProps, { listTemplates })(ListPage));
