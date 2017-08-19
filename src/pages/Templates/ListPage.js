import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import _ from 'lodash';

// Actions
import { listTemplates } from '../../actions/templates';

// Components
import Layout from '../../components/Layout/Layout';
import ListRow from './components/ListRow';
import Collection from '../../components/Collection/Collection';
import { Page } from '@sparkpost/matchbox';

const CREATE_ACTION = {
  content: 'Create Template',
  to: '/templates/create',
  Component: Link
};
const columns = ['Name', 'ID', 'Published', 'Updated'];

class ListPage extends Component {
  state = {
    perPage: 10,
    currentPage: 0
  }

  getCurrentPage() {
    const { perPage, currentPage } = this.state;
    const { templates } = this.props;
    const currentIndex = currentPage * perPage;
    return templates.slice(currentIndex, currentIndex + perPage);
  }

  componentDidMount() {
    this.props.listTemplates();
  }

  renderError() {
    const { error } = this.props;
    const errorRow = <p>An error occurred loading templates. <small>({error.message})</small></p>;
    return (
      <div>
        <Collection columns={columns} rowData={[1]} rowComponent={() => errorRow} />
      </div>
    );
  }

  renderCollection() {
    const { templates, location } = this.props;
    return (
      <Collection
        columns={columns}
        rowData={templates}
        rowComponent={ListRow}
        rowKeyName="id"
        pagination={true}
        defaultPerPage={25}
        perPageButtons={[10, 25, 50]}
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
