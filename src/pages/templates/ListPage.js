import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import config from 'src/config';

// Actions
import { listTemplates } from 'src/actions/templates';
import { getTemplates, getfilterTemplates } from 'src/selectors/templates';

// Components
import { Layout, TableCollection, ApiErrorBanner } from 'src/components';
import { Page, EmptyState } from '@sparkpost/matchbox';
import Filters from './components/Filters';
import { getRowData, TableHeader } from './components/TableComponents';

const primaryAction = {
  content: 'Create Template',
  to: '/templates/create',
  Component: Link
};

export class ListPage extends Component {

  componentDidMount() {
    this.props.listTemplates();
  }

  renderError() {
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your templates.'}
        errorDetails={this.props.error.message}
        reload={this.props.listTemplates}
      />
    );
  }

  renderCollection() {
    return (
      <TableCollection
        headerComponent={<TableHeader />}
        rows={this.props.templates}
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
            action={primaryAction} >
            {/* secondaryAction={content: 'Learn More', onClick: Learn_More()} > */}
            <p>Build, test, preview and send your transmissions.</p>
          </EmptyState>
        </Layout.App>
      );
    }

    return (
      <Layout.App loading={loading}>
        <Page
          primaryAction={primaryAction}
          title='Templates'
        />
        {error && this.renderError()}
        {!error && count > config.filters.minCount && <Filters />}
        {!error && this.renderCollection()}
      </Layout.App>
    );
  }
}

function mapStateToProps(state) {
  return {
    count: getTemplates(state).length,
    templates: getfilterTemplates(state),
    loading: state.templates.listLoading,
    error: state.templates.listError
  };
}

export default withRouter(connect(mapStateToProps, { listTemplates })(ListPage));
