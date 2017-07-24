import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

// Actions
import { getTemplate, resetTemplate, updateTemplate } from '../../actions/templates';

// Components
import Layout from '../../components/Layout/Layout';
import EditForm from './components/EditForm';
import Editor from './components/Editor';
import { Page, Panel, Grid } from '@sparkpost/matchbox';

class EditPage extends Component {
  componentDidMount () {
    const { match, getTemplate, resetTemplate } = this.props;
    if (match.params.id) {
      getTemplate(match.params.id);
    } else {
      resetTemplate();
    }
  }

  handleUpdate (params) {
    this.props.updateTemplate(params);
  }

  render () {
    const {
      match,
      loading,
      handleSubmit,
      updateTemplate
    } = this.props;

    const primaryAction = {
      content: 'Save & Publish',
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

    if (match.params.id && loading) {
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
          secondaryActions={secondaryActions}
          breadcrumbAction={backAction}
          title={match.params.id || 'New Template'}
        />
        <Grid>
          <Grid.Column xs={6}>
            <EditForm />
          </Grid.Column>
          <Grid.Column xs={6}>
            <Editor />
          </Grid.Column>
        </Grid>
      </Layout.App>
    );
  }
}

function mapStateToProps ({ templates, form }) {
  return {
    loading: templates.getLoading,
    id: form.templateEdit && form.templateEdit.values.id
  };
}

const formOptions = {
  form: 'templateEdit'
};

export default connect(mapStateToProps, { getTemplate, resetTemplate, updateTemplate })(reduxForm(formOptions)(EditPage));
