import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, formValues } from 'redux-form';
// Actions
import {
  getDraft,
  getPublished,
  reset,
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
    newTemplate: false,
    showPublished: false
  }

  componentDidMount () {
    const {
      match,
      getDraft,
      getPublished,
      reset
    } = this.props;
    if (match.params.id) {
      this.setState({ newTemplate: false });
      getDraft(match.params.id);
      // getPublished(match.params.id);
    } else {
      this.setState({ newTemplate: true });
      reset();
    }
  }

  componentDidUpdate () {
    const {
      id,
      submitSucceeded,
      history
    } = this.props;
  }

  handleUpdateOrCreate (values, shouldPublish = false, params) {
    const {
      update,
      create,
      publish
    } = this.props;

    if (this.state.newTemplate) {
      return create(values);
    } else {
      return update(values).then(() => {
        if (shouldPublish) {
          publish(values.id);
        }
      });
    }
  }

  renderPageHeader () {
    const {
      newTemplate,
      showPublished
    } = this.state;

    const {
      handleSubmit,
      published,
      id
    } = this.props;

    const primaryAction = {
      content: newTemplate ? 'Save Template' : 'Publish Template',
      onClick: handleSubmit((values) => this.handleUpdateOrCreate(values, true))
    };

    const viewActions = published ? [
      {
        content: !showPublished ? 'View Published' : 'View Draft'
      }
    ] : null;

    const editActions = !showPublished ? [
      {
        content: 'Save as Draft',
        onClick: handleSubmit((values) => this.handleUpdateOrCreate(values))
      },
      {
        content: 'Delete'
      },
      {
        content: 'Duplicate'
      }
    ] : null;

    const secondaryActions = [
      ...viewActions, ...editActions,
      {
        content: 'Preview & Send'
      }
    ];

    const backAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

    let title = newTemplate ? 'New Template' : id;

    if (!newTemplate) {
      if (showPublished) {
        title = `${title} (Published)`;
      } else {
        title = `${title} (Draft)`;
      }
    }

    return (
      <Page
        primaryAction={primaryAction}
        secondaryActions={!newTemplate ? secondaryActions : []}
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
      published,
      handleSubmit,
      submitSucceeded
    } = this.props;

    const { newTemplate } = this.state;

    if (newTemplate && submitSucceeded) {
      return <Redirect to={`/templates/edit/${this.props.id}`} />;
    }

    if (!newTemplate && loading) {
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
            <Form newTemplate={newTemplate} />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor />
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
  id: selector(state, 'id')
});
const formOptions = {
  form: 'templateEdit'
};

export default connect(mapStateToProps, {
  getDraft,
  getPublished,
  reset,
  update,
  create,
  publish
})(reduxForm(formOptions)(EditPage));
