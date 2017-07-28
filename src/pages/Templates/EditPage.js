import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
// Actions
import {
  getDraft,
  getPublished,
  clear,
  update,
  deleteTemplate,
  publish
} from '../../actions/templates';

// Components
import Layout from '../../components/Layout/Layout';
import Form from './components/Form';
import Editor from './components/Editor';
import DeleteModal from './components/DeleteModal';
import { Page, Panel, Grid } from '@sparkpost/matchbox';

const FORM_NAME = 'templateEdit';

class EditPage extends Component {
  state = {
    shouldRedirectToPublished: false,
    shouldRedirectToList: false,
    deleteOpen: false
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

  handleDelete () {
    const { deleteTemplate, match } = this.props;
    return deleteTemplate(match.params.id)
      .then(() => this.setState({ shouldRedirectToList: true }));
  }

  handleDeleteModalToggle () {
    this.setState({ deleteOpen: !this.state.deleteOpen });
  }

  renderPageHeader () {
    const {
      handleSubmit,
      published,
      match,
      submitting
    } = this.props;

    const primaryAction = {
      content: 'Publish Template',
      onClick: handleSubmit((values) => this.handlePublish(values)),
      disabled: submitting
    };

    const viewActions = published ? [
      {
        content: 'View Published',
        Component: Link,
        to: `/templates/edit/${match.params.id}/published`
      }
    ] : [];

    const secondaryActions = [
      ...viewActions,
      {
        content: 'Save as Draft',
        onClick: handleSubmit((values) => this.handleSave(values)),
        disabled: submitting
      },
      {
        content: 'Delete',
        onClick: () => this.handleDeleteModalToggle()
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

    let title = `${match.params.id} (Draft)`;

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
      loading,
      draft
    } = this.props;

    if (this.state.shouldRedirectToPublished) {
      return <Redirect to={`/templates/edit/${match.params.id}/published`} />;
    }

    if (this.state.shouldRedirectToList) {
      return <Redirect to='/templates/' />;
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
            <Form name={FORM_NAME} initialValues={draft} />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name={FORM_NAME} initialValues={draft} />
          </Grid.Column>
        </Grid>
        <DeleteModal
          open={this.state.deleteOpen}
          handleToggle={() => this.handleDeleteModalToggle()}
          handleDelete={() => this.handleDelete()}/>
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ templates }) => ({
  loading: templates.getLoading,
  draft: templates.draft,
  published: templates.published,
  initialValues: templates.draft
});
const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

export default connect(mapStateToProps, {
  getDraft,
  getPublished,
  clear,
  update,
  deleteTemplate,
  publish
})(reduxForm(formOptions)(EditPage));
