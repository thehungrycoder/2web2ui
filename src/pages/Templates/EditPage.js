import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, formValues } from 'redux-form';
// Actions
import { getTemplate, resetTemplate, updateTemplate, createTemplate, publishTemplate } from '../../actions/templates';

// Components
import Layout from '../../components/Layout/Layout';
import Form from './components/Form';
import Editor from './components/Editor';
import { Page, Panel, Grid } from '@sparkpost/matchbox';

class EditPage extends Component {
  state = {
    newTemplate: false
  }

  componentDidMount () {
    const { match, getTemplate, resetTemplate } = this.props;
    if (match.params.id) {
      this.setState({ newTemplate: false });
      getTemplate(match.params.id);
    } else {
      this.setState({ newTemplate: true });
      resetTemplate();
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
      updateTemplate,
      createTemplate,
      publishTemplate
    } = this.props;

    if (this.state.newTemplate) {
      return createTemplate(values);
    } else {
      return updateTemplate(values).then(() => {
        if (shouldPublish) {
          publishTemplate(values.id);
        }
      });
    }
  }

  render () {
    const {
      match,
      id,
      loading,
      handleSubmit,
      submitSucceeded,
      published
    } = this.props;

    const { newTemplate } = this.state;

    if (newTemplate && submitSucceeded) {
      return <Redirect to={`/templates/edit/${this.props.id}`} />;
    }

    const primaryAction = {
      content: newTemplate ? 'Save Template' : 'Save & Publish',
      onClick: handleSubmit((values) => this.handleUpdateOrCreate(values, true))
    };

    const secondaryActions = [
      {
        content: 'Save',
        onClick: handleSubmit((values) => this.handleUpdateOrCreate(values))
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

    const backAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

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
        <Page
          primaryAction={primaryAction}
          secondaryActions={!newTemplate ? secondaryActions : []}
          breadcrumbAction={backAction}
          title={newTemplate ? 'New Template' : id }
        />
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
  id: selector(state, 'id'),
  published: selector(state, 'published')
});
const formOptions = {
  form: 'templateEdit'
};

export default connect(mapStateToProps, {
  getTemplate, resetTemplate, updateTemplate, createTemplate, publishTemplate
})(reduxForm(formOptions)(EditPage));
