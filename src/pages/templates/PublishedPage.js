import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ContentEditor from 'src/components/contentEditor';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import Form from './components/containers/Form.container';
import { Loading } from 'src/components';
import { Page, Grid } from '@sparkpost/matchbox';

export default class PublishedPage extends Component {
  componentDidMount() {
    const { match, getPublished, getTestData, subaccountId } = this.props;
    getPublished(match.params.id, subaccountId);
    getTestData({ id: match.params.id, mode: 'published' });
  }

  componentDidUpdate() {
    const { showAlert, getPublishedError } = this.props;

    if (getPublishedError) {
      showAlert({ type: 'error', message: 'Unable to load template' });
      this.props.history.push('/templates/');
    }
  }

  handlePreview = ({ testData }) => {
    const { setTestData, match: { params: { id }}, history, subaccountId } = this.props;
    const query = setSubaccountQuery(subaccountId);

    return setTestData({ id, data: testData, mode: 'published' }).then(
      () => history.push(`/templates/preview/${id}/published${query}`)
    );
  };

  getPageProps() {
    const { canModify, handleSubmit, match, subaccountId } = this.props;
    const query = setSubaccountQuery(subaccountId);

    const secondaryActions = [
      {
        content: 'Edit Draft',
        component: Link,
        to: `/templates/edit/${match.params.id}${query}`
      },
      {
        content: canModify ? 'Preview & Send' : 'Preview',
        onClick: handleSubmit(this.handlePreview)
      }
    ];

    const breadcrumbAction = {
      content: 'Templates',
      component: Link,
      to: '/templates'
    };

    return { secondaryActions, breadcrumbAction, title: `${match.params.id} (Published)` };
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
            <Form name={formName} subaccountId={subaccountId} readOnly />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <ContentEditor readOnly />
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}
