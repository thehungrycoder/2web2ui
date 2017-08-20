import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import _ from 'lodash';

// Actions
import { listTemplates } from '../../actions/templates';

// Components
import Layout from '../../components/Layout/Layout';
import ListRow from './components/ListRow';
import TableCollection from '../../components/Collection/TableCollection';
import { Page, Banner, Button } from '@sparkpost/matchbox';

const CREATE_ACTION = {
  content: 'Create Template',
  to: '/templates/create',
  Component: Link
};
const columns = ['Name', 'ID', 'Published', 'Updated'];

class ListPage extends Component {
  state = {
    showErrorDetails: false
  }

  componentDidMount() {
    this.props.listTemplates();
  }

  renderError() {
    const { error } = this.props;
    const { showErrorDetails } = this.state;
    const buttonText = showErrorDetails ? 'Hide Error Details' : 'Show Error Details';

    return (
      <Banner status='warning' title='An error occurred'>
        <p>Sorry, we seem to have had some trouble loading your templates.</p>

        <Button outline={true} onClick={() => this.props.listTemplates()} style={{ marginRight: '10px' }}>
          Try Again
        </Button>
        <Button outline={true} onClick={() => this.setState({ showErrorDetails: !showErrorDetails })}>
          {buttonText}
        </Button>

        {showErrorDetails && <p style={{ marginTop: '20px' }}><strong>Details:</strong> {error.message}</p>}
      </Banner>
    );
  }

  renderCollection() {
    const { templates, location } = this.props;
    return (
      <TableCollection
        columns={columns}
        rowData={templates}
        rowComponent={ListRow}
        rowKeyName="id"
        pagination={true}
        defaultPerPage={25}
        location={location}
      />
    );
  }

  render() {
    const templatesCount = _.get(this, 'props.templates.length');
    const { loading, error } = this.props;

    // No Templates (not error case)
    if (!loading && templatesCount === 0) {
      return <Redirect to="/templates/create" />;
    }

    return (
      <Layout.App loading={loading}>
        <Page
          primaryAction={CREATE_ACTION}
          title={'Templates'}
        />
        {error && this.renderError()}
        {!error && templatesCount > 0 && this.renderCollection()}
      </Layout.App>
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
