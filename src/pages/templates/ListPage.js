/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { listTemplates } from 'src/actions/templates';
import { getTemplates } from 'src/selectors/templates';
import { getRowData, columns, filterBoxConfig } from './tableConfig';
import { TableCollection, ApiErrorBanner, Loading } from 'src/components';
import { Page } from '@sparkpost/matchbox';

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
      <div>
        <Page
          primaryAction={primaryAction}
          title='Templates'
          empty={{
            test: count === 0,
            title: 'Manage your email templates'
          }}
        />
        {error && this.renderError()}
        {!error && this.renderCollection()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const templates = getTemplates(state);
  return {
    count: templates.length,
    templates,
    loading: state.templates.listLoading,
    error: state.templates.listError
  };
}

export default withRouter(connect(mapStateToProps, { listTemplates })(ListPage));
