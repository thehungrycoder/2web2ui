import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Actions
import { listTemplates } from '../actions/templates';

// Components
import Layout from '../components/Layout/Layout';
import { Panel, Table, Button, Pagination } from '@sparkpost/matchbox';

class TemplatesPage extends Component {
  state = {
    perPage: 10,
    currentPage: 0
  }

  renderRow (template) {
    const status = template.published ? 'published' : 'draft';
    const nameLink = <Link to="/dashboard">{template.name}</Link>;
    return (
      <Table.Row key={template.id} rowData={ [nameLink, template.id, status, Date(template.last_update_time)]} >

      </Table.Row>
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

    if (!templatesCount) {
      return <Layout.App />;
    }

    const templateRows = templatesCount ? this.renderTemplateRows(this.props.templates, this.state.currentPage, this.state.perPage) : null;

    return (

      <Layout.App>

        <h1>Templates</h1>
        <Button primary>Create Template</Button>

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
  return { templates: templates.list };
}

export default connect(mapStateToProps, { listTemplates })(TemplatesPage);
