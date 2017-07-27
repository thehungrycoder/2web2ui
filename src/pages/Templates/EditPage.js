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

class EditPage extends Component {
  state = {
    shouldRedirectToPublished: false
  };

  componentDidMount () {
    const {
      match,
      getDraft,
      getPublished,
      clear
    } = this.props;

    clear();
    getDraft(match.params.id);
    getPublished(match.params.id);
  }

  handlePublish (values) {
    const { update, publish, match, getDraft } = this.props;
    return update(values)
      .then(() => publish(match.params.id))
      .then(() => getDraft(match.params.id))
      .then(() => this.setState({ shouldRedirectToPublished: true }));
  }

  handleSave (values) {
    const { update, match, getDraft } = this.props;
    return update(values)
      .then(() => getDraft(match.params.id));
  }

  renderPageHeader () {
    const {
      handleSubmit,
      published,
      id
    } = this.props;

    const primaryAction = {
      content: 'Publish Template',
      onClick: handleSubmit((values) => this.handlePublish(values))
    };

    const viewActions = published ? [
      {
        content: 'View Published',
        Component: Link,
        to: `/templates/edit/${this.props.id}/published`
      }
    ] : [];

    const secondaryActions = [
      ...viewActions,
      {
        content: 'Save as Draft',
        onClick: handleSubmit((values) => this.handleSave(values))
      },
      {
        content: 'Delete',
        disabled: true
      },
      {
        content: 'Duplicate',
        disabled: true
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

    let title = `${id} (Draft)`;

    return (
      <Page
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
        breadcrumbAction={backAction}
        title={title}
      />
    );
  }

  render () {
    const {
      match,
      id,
      loading,
      draft,
      handleSubmit,
      submitSucceeded
    } = this.props;

    if (submitSucceeded && this.state.shouldRedirectToPublished) {
      return <Redirect to={`/templates/edit/${this.props.id}/published`} />;
    }

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
            <Form name='templateEdit' initialValues={draft} />
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
})(reduxForm(formOptions)(EditPage));
