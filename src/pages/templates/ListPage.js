import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { listTemplates } from 'src/actions/templates';
import { selectTemplates } from 'src/selectors/templates';
import { getRowData, columns, filterBoxConfig } from './tableConfig';
import { TableCollection, ApiErrorBanner, Loading } from 'src/components';
import { Page } from '@sparkpost/matchbox';
import Editor from './components/Editor'; // async, for preload

const primaryAction = {
  content: 'Create Template',
  to: '/templates/create',
  Component: Link
};

export class ListPage extends Component {

  componentDidMount() {
    this.props.listTemplates();
    Editor.preload(); //loads editor chunk
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
        columns={columns}
        rows={this.props.templates}
        getRowData={getRowData}
        pagination
        filterBox={filterBoxConfig}
      />
    );
  }

  render() {
    const { count, loading, error } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        primaryAction={primaryAction}
        title='Templates'
        empty={{
          show: count === 0,
          image: 'Templates',
          title: 'Manage your email templates',
          content: <p>Build, test, preview and send your transmissions.</p>
        }} >
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const templates = selectTemplates(state);
  return {
    count: templates.length,
    templates,
    loading: state.templates.listLoading,
    error: state.templates.listError
  };
}

export default withRouter(connect(mapStateToProps, { listTemplates })(ListPage));
