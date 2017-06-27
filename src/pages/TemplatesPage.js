import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';

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
    const status = template.published ? 'published' : 'unpublished';
    return <Table.Row key={template.id} rowData={ [template.name, template.id, status] } />;
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
    const templateCount = this.props.templates.length;
    const templateRows = templateCount ? this.renderTemplateRows(this.props.templates, this.state.currentPage, this.state.perPage) : null;

    return (

      <Layout.App>

        <h1>Templates</h1>
        <Button primary={ true }>Create Template</Button>

        <Panel>
          <Table>
            <thead>
              <Table.Row>
                <Table.HeaderCell>Label</Table.HeaderCell>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </thead>
            <tbody>
              { templateRows }
            </tbody>
          </Table>
        </Panel>
        <Pagination
          pages={Math.floor(templateCount / this.state.perPage)}
          pageRange={5}
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
