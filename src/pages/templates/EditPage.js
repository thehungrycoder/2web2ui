/* eslint max-lines: ["error", 200] */
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
// Actions
import { getDraft, getPublished, update, deleteTemplate, publish } from '../../actions/templates';

// Selectors
import { templateById } from 'selectors/templates';

// Components
import { Layout } from 'components';
import Form from './components/Form';
import Editor from './components/Editor';
import DeleteModal from './components/DeleteModal';
import { Page, Grid } from '@sparkpost/matchbox';

const FORM_NAME = 'templateEdit';

class EditPage extends Component {
  state = {
    redirectTo: null,
    deleteOpen: false
  };

  componentDidMount() {
    const { match, getDraft, getPublished } = this.props;
    getDraft(match.params.id);
    getPublished(match.params.id);
  }

  handlePublish(values) {
    const { update, publish, match, getDraft } = this.props;
    return update(values)
      .then(() => publish(match.params.id))
      .then(() => getDraft(match.params.id))
      .then(() => this.setState({ redirectTo: `/templates/edit/${match.params.id}/published` }));
  }

  handleSave(values) {
    const { update, match, getDraft } = this.props;
    return update(values)
      .then(() => getDraft(match.params.id));
  }

  handleDelete() {
    const { deleteTemplate, match } = this.props;
    return deleteTemplate(match.params.id)
      .then(() => this.setState({ redirectTo: '/templates/' }));
  }

  handleDeleteModalToggle() {
    this.setState({ deleteOpen: !this.state.deleteOpen });
  }

  componentDidUpdate() {
    const { loading, template } = this.props;
    if (!loading && !template.draftDetails && !template.publishedDetails) {
      // Redirect if no draft or published found
      // TODO: show error banner?
      this.setState({ redirectTo: '/templates/' });
    }
  }

  renderPageHeader() {
    const {
      handleSubmit,
      template,
      match,
      submitting
    } = this.props;
    const published = template.publishedDetails;

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
      { content: 'Delete', onClick: () => this.handleDeleteModalToggle() },
      { content: 'Duplicate', disabled: true },
      { content: 'Preview & Send', disabled: true }
    ];

    const backAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

    return (
      <Page
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
        breadcrumbAction={backAction}
        title={`${match.params.id} (Draft)`}
      />
    );
  }

  render() {
    const { loading } = this.props;

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <Layout.App loading={loading}>
        { this.renderPageHeader() }
        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form name={FORM_NAME} />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name={FORM_NAME} />
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

const mapStateToProps = ({ templates }, { match }) => {
  const template = templateById(templates, match.params.id);
  return {
    loading: templates.getLoading,
    template,
    // For templates with published but no draft, pull in published values
    initialValues: template.draftDetails || template.publishedDetails
  };
};
const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

export default connect(mapStateToProps, {
  getDraft,
  getPublished,
  update,
  deleteTemplate,
  publish
})(reduxForm(formOptions)(EditPage));
