/* eslint max-lines: ["error", 200] */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

// Actions
import { getDraft, getPublished, update, deleteTemplate, publish, getTestData } from 'src/actions/templates';
import { showAlert } from 'src/actions/globalAlert';

// Selectors
import { selectTemplateById, selectTemplateTestData } from 'src/selectors/templates';

// Components
import Form from './components/Form';
import Editor from './components/Editor'; // async
import { DeleteModal } from 'src/components';
import { Loading } from 'src/components';
import { Page, Grid } from '@sparkpost/matchbox';
import _ from 'lodash';

const FORM_NAME = 'templateEdit';

export class EditPage extends Component {
  state = {
    deleteOpen: false
  };

  static defaultProps = {
    template: {}
  }

  componentDidMount() {
    const { match, getDraft, getPublished, getTestData } = this.props;
    // Do nothing if these fail
    getDraft(match.params.id).catch((err) => err);
    getPublished(match.params.id).catch((err) => err);
    getTestData({ id: match.params.id, mode: 'draft' });
  }

  handlePublish = (values) => {
    const { publish, match, showAlert, history } = this.props;
    return publish(values).then(() => {
      history.push(`/templates/edit/${match.params.id}/published`);
      showAlert({ type: 'success', message: 'Template published' });
    }).catch((err) => {
      showAlert({ type: 'error', message: 'Could not publish template', details: err.message });
    });
  }

  handleSave = (values) => {
    const { update, match, getDraft, showAlert, getTestData } = this.props;
    return update(values).then(() => {
      getDraft(match.params.id);
      getTestData({ id: match.params.id, mode: 'draft' });
      showAlert({ type: 'success', message: 'Template saved' });
    }).catch((err) => {
      showAlert({ type: 'error', message: 'Could not save template', details: err.message });
    });
  }

  handleDelete = () => {
    const { deleteTemplate, match, showAlert, history } = this.props;
    return deleteTemplate(match.params.id).then(() => {
      history.push('/templates/');
      showAlert({ message: 'Template deleted' });
    }).catch((err) => {
      showAlert({ type: 'error', message: 'Could not delete template', details: err.message });
    });
  }

  handleDeleteModalToggle = () => {
    this.setState({ deleteOpen: !this.state.deleteOpen });
  }

  componentDidUpdate() {
    const { loading, template, showAlert, history } = this.props;

    if (loading || !template) {
      return;
    }

    const { draft, published } = template;

    if (_.isEmpty(draft) && _.isEmpty(published)) {
      history.push('/templates/'); // Redirect if no draft or published found
      showAlert({ type: 'error', message: 'Could not find template' });
    }
  }

  getPageProps() {
    const { handleSubmit, template, match, submitting } = this.props;
    const published = template.published;

    const primaryAction = {
      content: 'Publish Template',
      onClick: handleSubmit(this.handlePublish),
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
        onClick: handleSubmit(this.handleSave),
        disabled: submitting
      },
      { content: 'Delete', onClick: this.handleDeleteModalToggle },
      { content: 'Duplicate', Component: Link, to: `/templates/create/${match.params.id}` },
      { content: 'Preview & Send', disabled: true }
    ];

    const breadcrumbAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

    return {
      secondaryActions,
      primaryAction,
      breadcrumbAction,
      title: `${match.params.id} (Draft)`
    };
  }

  render() {
    if (this.props.loading) {
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
  const template = selectTemplateById(state, props);
  const values = template.draft || template.published; // For templates with published but no draft, pull in published values
  return {
    loading: state.templates.getLoading,
    template,
    initialValues: { testData: selectTemplateTestData(state), ...values }
  };
};

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

const mapDispatchToProps = {
  getDraft,
  getPublished,
  getTestData,
  update,
  deleteTemplate,
  publish,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(reduxForm(formOptions)(EditPage)));
