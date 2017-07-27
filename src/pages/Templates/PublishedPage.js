import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, formValues } from 'redux-form';
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
    const {
      handleSubmit,
      match
    } = this.props;

    const secondaryActions = [
      {
        content: 'View Draft',
        Component: Link,
        to: `/templates/edit/${this.props.id}`
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
    const {
      match,
      id,
      loading,
      published,
      handleSubmit,
      submitSucceeded
    } = this.props;

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
            <Form name='templateEdit' initialValues={published} />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name='templateEdit' />
          </Grid.Column>
        </Grid>
      </Layout.App>
    );
  }
}

const selector = formValueSelector('templateEdit');
const mapStateToProps = (state) => ({
  loading: state.templates.getLoading,
  draft: state.templates.draft,
  published: state.templates.published,
  id: selector(state, 'id'),
  initialValues: state.templates.draft
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
