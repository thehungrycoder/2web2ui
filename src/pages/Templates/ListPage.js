import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Actions
import { listTemplates } from '../../actions/templates';

// Components
import Layout from '../../components/Layout/Layout';
import { Page, Panel, Table, Button, Pagination } from '@sparkpost/matchbox';

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

  renderRow (template) {
    const status = template.published ? 'published' : 'draft';
    const nameLink = <Link to={`/templates/edit/${template.id}`}>{template.name}</Link>;
    return (
      <Table.Row key={template.id} rowData={[nameLink, template.id, status, Date(template.last_update_time)]} />
    );
  }

  renderTemplateRows (templates, currentPage, perPage) {
    const currentIndex = currentPage * perPage;
    return templates.slice(currentIndex, currentIndex + perPage).map(
      (template) => this.renderRow(template)
    );
  }

  componentDidMount () {
    this.props.listTemplates();
  }

  render () {
    const templatesCount = this.props.templates.length;
    const loading = this.props.listLoading;

    // No Templates (not error case)
    if (!loading && !templatesCount) {
      // TODO: instead of making a CTA here, we could just redirect to the create page
      return (
        <Layout.App>
            <Page
              title={'Templates'}
            />
            <Panel>
            <Panel.Section>
              Lets get you started with your first template
            </Panel.Section>
            <Panel.Section>
              <Button
                primary
                {...CREATE_ACTION}
                >Create Template</Button>
            </Panel.Section>
          </Panel>
        </Layout.App>
      );
    }

    // Maybe do an error state.

    const templateRows = templatesCount ? this.renderTemplateRows(this.props.templates, this.state.currentPage, this.state.perPage) : null;

    return (
      <Layout.App loading={loading}>
        <Page
          primaryAction={CREATE_ACTION}
          title={'Templates'}
        />
        <Panel>
            <Table>
              <thead>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>Published</Table.HeaderCell>
                  <Table.HeaderCell>Updated</Table.HeaderCell>
                </Table.Row>
              </thead>
              <tbody>
                { templateRows }
              </tbody>
            </Table>
        </Panel>
        <Pagination
          pages={Math.ceil(templatesCount / this.state.perPage)}
          pageRange={5}
          initialIndex={0}
          onChange={(index) => { this.setState({currentPage: index}); }}
        />
        <Button.Group>
          Show:
          <Button onClick={ () => { this.setState({ perPage: 10 }); } }>10</Button>
          <Button onClick={ () => { this.setState({ perPage: 25 }); } }>25</Button>
          <Button onClick={ () => { this.setState({ perPage: 50 }); } }>50</Button>
        </Button.Group>
      </Layout.App>
    );
  }
}

function mapStateToProps ({ templates }) {
  return {
    templates: templates.list,
    listLoading: templates.listLoading
  };
}

export default connect(mapStateToProps, { listTemplates })(ListPage);
