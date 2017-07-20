import React, { Component } from 'react';

// Components
import Layout from '../../components/Layout/Layout';
import EditForm from './components/EditForm';
import Editor from './components/Editor';
import { Page, Panel, Grid } from '@sparkpost/matchbox';

const primaryAction = {
  content: 'Save & Publish'
};

const secondaryActions = [
  {
    content: 'Save'
  },
  {
    content: 'Delete'
  },
  {
    content: 'Duplicate'
  },
  {
    content: 'Preview & Send'
  }
];

class EditPage extends Component {
  render () {
    const {
      match
    } = this.props;

    return (
      <Layout.App>
        <Page
          primaryAction={primaryAction}
          secondaryActions={secondaryActions}
          breadcrumbAction={{
            content: 'Templates',
            onClick: () => this.props.history.push('/templates')
          }}
          title={match.params.id || 'New Template'}
        />
        <Grid>
          <Grid.Column xs={5}>
            <EditForm />
          </Grid.Column>
          <Grid.Column xs={7}>
            <Editor />
          </Grid.Column>
        </Grid>
      </Layout.App>
    );
  }
}

export default EditPage;
