import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
// Actions
import { getTemplate, resetTemplate, updateTemplate, createTemplate } from '../../actions/templates';

// Components
import Layout from '../../components/Layout/Layout';
import EditForm from './components/EditForm';
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

    if (this.state.newTemplate && submitSucceeded) {
      history.push(`/templates/edit/${id}`);
    }
  }

  handleUpdate (params) {
    const { updateTemplate, createTemplate } = this.props;

    if (this.state.newTemplate) {
      createTemplate();
    } else {
      updateTemplate(params);
    }
  }

  render () {
    const {
      match,
      loading,
      handleSubmit
    } = this.props;

    const { newTemplate } = this.state;

    const primaryAction = {
      content: newTemplate ? 'Save' : 'Save & Publish',
      onClick: handleSubmit(() => this.handleUpdate({ update_published: true }))
    };

    const secondaryActions = [
      {
        content: 'Save',
        onClick: handleSubmit(() => this.handleUpdate())
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
          title={newTemplate ? 'New Template' : match.params.id }
        />
        <Grid>
          <Grid.Column xs={6}>
            <EditForm newTemplate={newTemplate} />
          </Grid.Column>
          <Grid.Column xs={6}>
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
  id: selector(state, 'id')
});
const formOptions = {
  form: 'templateEdit'
};

export default connect(mapStateToProps, {
  getTemplate, resetTemplate, updateTemplate, createTemplate
})(reduxForm(formOptions)(EditPage));
