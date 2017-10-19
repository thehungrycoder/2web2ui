import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

// Actions
import { listTemplates } from '../../actions/templates';

// Components
import { TableCollection, ApiErrorBanner } from 'src/components';
import { Page } from '@sparkpost/matchbox';

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
    const templatesCount = _.get(this, 'props.templates.length');
    const { loading, error } = this.props;

    // No Templates (not error case)
    // This is broken on a hard refresh
    // if (!loading && templatesCount === 0) {
    //   return <Redirect to="/templates/create" />;
    // }

    return (
      <div loading={loading}>
        <Page
          primaryAction={CREATE_ACTION}
          title={'Templates'}
        />
        {error && this.renderError()}
        {!error && templatesCount > 0 && this.renderCollection()}
      </div>
    );
  }
}

function mapStateToProps({ templates }) {
  return {
    templates: templates.list,
    loading: templates.listLoading,
    error: templates.listError
  };
}

export default connect(mapStateToProps, { listTemplates })(ListPage);
