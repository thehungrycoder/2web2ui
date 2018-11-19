import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import _ from 'lodash';
// Components
import ContentEditor from 'src/components/contentEditor';
import Form from './components/containers/Form.container';
import { DeleteModal, Loading } from 'src/components';
import { Grid, Page } from '@sparkpost/matchbox';
import ImportSnippetLink from './components/ImportSnippetLink';

export default class EditPage extends Component {
  state = {
    deleteOpen: false
  };

  componentDidMount() {
    const { match, getDraft, getTestData, subaccountId } = this.props;

    getDraft(match.params.id, subaccountId);
    getTestData({ id: match.params.id, mode: 'draft' });
  }

  componentDidUpdate() {
    const { showAlert, getDraftError } = this.props;

    if (getDraftError) {
      showAlert({ type: 'error', message: 'Unable to load template' });
      this.props.history.push('/templates/');
    }
  }

  handlePublish = (values) => {
    const { publish, match, showAlert, history, subaccountId } = this.props;
    return publish(_.omit(values, 'published'), subaccountId).then(() => {
      history.push(`/templates/edit/${match.params.id}/published${setSubaccountQuery(subaccountId)}`);
      showAlert({ type: 'success', message: 'Template published' });
    });
  }

  handleSave = (values) => {
    const { update, match, getDraft, showAlert, getTestData, subaccountId } = this.props;
    return update(_.omit(values, 'published'), subaccountId).then(() => {
      getDraft(match.params.id, subaccountId);
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

  handlePreview = ({ testData }) => {
    const { setTestData, match: { params: { id }}, subaccountId, history } = this.props;
    return setTestData({ id, data: testData, mode: 'draft' }).then(
      () => history.push(`/templates/preview/${id}${setSubaccountQuery(subaccountId)}`)
    );
  };

  handleDeleteModalToggle = () => {
    this.setState({ deleteOpen: !this.state.deleteOpen });
  }

  getPageProps() {
    const { canModify, handleSubmit, template, match, submitting, subaccountId } = this.props;
    const published = template.has_published;

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
        component: Link,
        to: `/templates/create/${match.params.id}`,
        visible: canModify
      },
      {
        content: canModify ? 'Preview & Send' : 'Preview',
        onClick: handleSubmit(this.handlePreview),
        visible: true
      }
    ];

    const breadcrumbAction = {
      content: 'Templates',
      component: Link,
      to: '/templates'
    };

    return {
      secondaryActions,
      primaryAction: canModify ? primaryAction : undefined,
      breadcrumbAction,
      title: `${match.params.id} (Draft)`
    };
  }

  render() {
    const { canModify, loading, formName, subaccountId, template } = this.props;

    if (loading || _.isEmpty(template)) {
      return <Loading />;
    }

    return (
      <Page {...this.getPageProps()}>
        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form name={formName} subaccountId={subaccountId} readOnly={!canModify} />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <ContentEditor readOnly={!canModify} action={canModify && <ImportSnippetLink />} />
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
