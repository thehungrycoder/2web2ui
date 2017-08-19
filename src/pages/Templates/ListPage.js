import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

// Actions
import { listTemplates } from '../../actions/templates';

// Components
import Layout from '../../components/Layout/Layout';
import ListRow from './components/ListRow';
import Collection from '../../components/Collection/Collection';
import { Page, Panel, Button } from '@sparkpost/matchbox';

const CREATE_ACTION = {
  content: 'Create Template',
  to: '/templates/create',
  Component: Link
};

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

  render() {
    const templatesCount = this.props.templates.length;
    const loading = this.props.listLoading;

    // No Templates (not error case)
    if (!loading && !templatesCount) {
      return <Redirect to="/templates/create" />;
    }

    // Maybe do an error state.

    // const templateRows = templatesCount ? this.renderTemplateRows(this.props.templates, this.state.currentPage, this.state.perPage) : null;
    const { templates, location } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page
          primaryAction={CREATE_ACTION}
          title={'Templates'}
        />
        <Collection
          columns={['Name', 'ID', 'Published', 'Updated']}
          rowData={templates}
          rowComponent={ListRow}
          rowKeyName="id"
          pagination={true}
          defaultPerPage={25}
          perPageButtons={[10, 25, 50]}
          location={location}
        />
      </Layout.App>
    );
  }
}

function mapStateToProps({ templates }) {
  return {
    templates: templates.list,
    listLoading: templates.listLoading
  };
}

export default connect(mapStateToProps, { listTemplates })(ListPage);
