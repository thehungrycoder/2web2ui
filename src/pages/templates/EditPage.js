import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { allSettled } from 'src/helpers/promise';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

// Components
import Form from './components/containers/Form.container';
import Editor from './components/Editor'; // async
import { Loading, DeleteModal } from 'src/components';
import { Page, Grid } from '@sparkpost/matchbox';

export default class EditPage extends Component {
  state = {
    deleteOpen: false
  };

  getTemplate() {
    const { match, getDraft, getPublished, subaccountId } = this.props;
    return allSettled([
      getDraft(match.params.id, subaccountId),
      getPublished(match.params.id, subaccountId)
    ], { onlyRejected: true });
  }

  componentDidMount() {
    const { match, getTestData, showAlert, history } = this.props;

    this.getTemplate().then((errors) => {
      if (errors.length === 2) {
        history.push('/templates/'); // Redirect if no draft or published found
        showAlert({ type: 'error', message: 'Could not find template' });
      }
    });

    getTestData({ id: match.params.id, mode: 'draft' });
  }

  handlePublish = (values) => {
    const { publish, match, showAlert, history, subaccountId } = this.props;
    return publish(values, subaccountId).then(() => {
      history.push(`/templates/edit/${match.params.id}/published${setSubaccountQuery(subaccountId)}`);
      showAlert({ type: 'success', message: 'Template published' });
    });
  }

  handleSave = (values) => {
    const { update, match, getDraft, showAlert, getTestData, subaccountId } = this.props;
    return update(values, subaccountId).then(() => {
      getDraft(match.params.id);
      getTestData({ id: match.params.id, mode: 'draft' });
      showAlert({ type: 'success', message: 'Template saved' });
    });
  }

  handleDelete = () => {
    const { deleteTemplate, match, showAlert, history, subaccountId } = this.props;
    return deleteTemplate(match.params.id, subaccountId).then(() => {
      history.push('/templates/');
      showAlert({ message: 'Template deleted' });
    });
  }

  handleDeleteModalToggle = () => {
    this.setState({ deleteOpen: !this.state.deleteOpen });
  }

  getPageProps() {
    const { canModify, handleSubmit, template, match, submitting, subaccountId } = this.props;
    const published = template.published;

    const primaryAction = {
      content: 'Publish Template',
      onClick: handleSubmit(this.handlePublish),
      disabled: submitting
    };

    const secondaryActions = [
      {
        content: 'View Published',
        Component: Link,
        to: `/templates/edit/${match.params.id}/published${setSubaccountQuery(subaccountId)}`,
        visible: published
      },
      {
        content: 'Save as Draft',
        onClick: handleSubmit(this.handleSave),
        disabled: submitting,
        visible: canModify
      },
      { content: 'Delete', onClick: this.handleDeleteModalToggle, visible: canModify },
      {
        content: 'Duplicate',
        Component: Link,
        to: `/templates/create/${match.params.id}`,
        visible: canModify
      },
      {
        content: 'Preview & Send',
        Component: Link,
        to: `/templates/preview/${match.params.id}${setSubaccountQuery(subaccountId)}`,
        visible: true
      }
    ];

    const visibleSecondaryActions = secondaryActions.reduce((result, { visible, ...action }) => (
      visible ? [...result, action] : result
    ), []);

    const breadcrumbAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

    return {
      secondaryActions: visibleSecondaryActions,
      primaryAction: canModify ? primaryAction : undefined,
      breadcrumbAction,
      title: `${match.params.id} (Draft)`
    };
  }

  render() {
    const { loading, formName, subaccountId } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page {...this.getPageProps()}>
        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form name={formName} subaccountId={subaccountId} />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name={formName} />
          </Grid.Column>
        </Grid>
        <DeleteModal
          open={this.state.deleteOpen}
          title='Are you sure you want to delete this template?'
          content={<p>Both the draft and published versions of this template will be deleted.</p>}
          onCancel={this.handleDeleteModalToggle}
          onDelete={this.handleDelete} />
      </Page>
    );
  }
}
