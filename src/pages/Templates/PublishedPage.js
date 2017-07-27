import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
// Actions
import {
  getDraft,
  getPublished,
  clear,
  update,
  create,
  publish
} from '../../actions/templates';

// Components
import Layout from '../../components/Layout/Layout';
import Form from './components/Form';
import Editor from './components/Editor';
import { Page, Panel, Grid } from '@sparkpost/matchbox';

class PublishedPage extends Component {
  state = {
    shouldRedirectToPublished: false
  };

  componentDidMount () {
    const {
      match,
      getPublished,
      clear
    } = this.props;

    clear();
    getPublished(match.params.id);
  }

  renderPageHeader () {
    const { match } = this.props;

    const secondaryActions = [
      {
        content: 'View Draft',
        Component: Link,
        to: `/templates/edit/${match.params.id}`
      },
      {
        content: 'Preview & Send',
        disabled: true
      }
    ];

    const backAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

    return (
      <Page
        secondaryActions={secondaryActions}
        breadcrumbAction={backAction}
        title={`${match.params.id} (Published)`}
      />
    );
  }

  render () {
    const { loading, published } = this.props;

    if (loading) {
      return (
        <Layout.App>
          <Panel sectioned>
            Loading template...
          </Panel>
        </Layout.App>
      );
    }

    return (
      <Layout.App>
        { this.renderPageHeader() }
        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form name='templatePublished' disableAll initialValues={published} />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name='templatePublished' disableAll initialValues={published} />
          </Grid.Column>
        </Grid>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.templates.getLoading,
  published: state.templates.published,
  initialValues: state.templates.published
});
const formOptions = {
  form: 'templateEdit',
  enableReinitialize: true // required to update initial values from redux state
};

export default connect(mapStateToProps, {
  getDraft,
  getPublished,
  clear,
  update,
  create,
  publish
})(reduxForm(formOptions)(PublishedPage));
