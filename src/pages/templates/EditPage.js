/* eslint max-lines: ["error", 200] */
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

// Actions
import { getDraft, getPublished, update, deleteTemplate, publish } from '../../actions/templates';
import { showAlert } from 'src/actions/globalAlert';

// Selectors
import { getTemplateById } from 'src/selectors/templates';

// Components
import Form from './components/Form';
import Editor from './components/Editor';
import { DeleteModal } from 'src/components';
import { Loading } from 'src/components';
import { Page, Grid } from '@sparkpost/matchbox';

const FORM_NAME = 'templateEdit';

class EditPage extends Component {
  state = {
    redirectTo: null,
    deleteOpen: false
  };

  componentDidMount() {
    const { match, getDraft, getPublished } = this.props;
    // Do nothing if these fail
    getDraft(match.params.id).catch((err) => err);
    getPublished(match.params.id).catch((err) => err);
  }

  handlePublish(values) {
    const { publish, match, showAlert } = this.props;
    return publish(match.params.id)
      .then(() => this.setState({ redirectTo: `/templates/edit/${match.params.id}/published` }))
      .then(() => showAlert({ type: 'success', message: 'Template published' }))
      .catch((err) => showAlert({ type: 'error', message: 'Could not publish template', details: err.message }));
  }

  handleSave(values) {
    const { update, match, getDraft, showAlert } = this.props;
    return update(values)
      .then(() => getDraft(match.params.id))
      .then(() => showAlert({ type: 'success', message: 'Template saved' }))
      .catch((err) => showAlert({ type: 'error', message: 'Could not save template', details: err.message }));
  }

  handleDelete = () => {
    const { deleteTemplate, match, showAlert } = this.props;
    return deleteTemplate(match.params.id)
      .then(() => this.setState({ redirectTo: '/templates/' }))
      .then(() => showAlert({ message: 'Template deleted' }))
      .catch((err) => showAlert({ type: 'error', message: 'Could not delete template', details: err.message }));
  }

  handleDeleteModalToggle = () => {
    this.setState({ deleteOpen: !this.state.deleteOpen });
  }

  componentDidUpdate() {
    const { loading, template, showAlert } = this.props;

    if (loading || !template) {
      return;
    }

    const { draft = {}, published = {}} = template;

    if (!Object.keys(draft).length && !Object.keys(published).length) {
      this.setState({ redirectTo: '/templates/' }); // Redirect if no draft or published found
      showAlert({ type: 'error', message: 'Could not find template' });
    }
  }

  getPageProps() {
    const {
      handleSubmit,
      template,
      match,
      submitting
    } = this.props;
    const published = template.published;

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
      { content: 'Duplicate', to: `/templates/create/${match.params.id}` },
      { content: 'Preview & Send', disabled: true }
    ];

    const backAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

    return {
      secondaryActions,
      primaryAction,
      backAction,
      title: `${match.params.id} (Draft)`
    };
  }

  render() {
    const { loading } = this.props;

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />; // TODO use history.push instead
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <Page {...this.getPageProps()}>
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
          title='Delete Template'
          text='Are you sure you want to delete this template? Both draft and published versions of this template will be deleted.'
          handleToggle={this.handleDeleteModalToggle}
          handleDelete={this.handleDelete} />
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => {
  const template = getTemplateById(state, props);
  return {
    loading: state.templates.getLoading,
    template,
    // For templates with published but no draft, pull in published values
    initialValues: template.draft || template.published
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
  publish,
  showAlert
})(reduxForm(formOptions)(EditPage));
