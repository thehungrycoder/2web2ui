import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import Form from './components/containers/Form.container';
import Editor from './components/Editor'; // async
import { Loading } from 'src/components';
import { Page, Grid } from '@sparkpost/matchbox';

export default class PublishedPage extends Component {
  componentWillMount() {
    const { match, getPublished, getTestData, subaccountId } = this.props;
    getPublished(match.params.id, subaccountId);
    getTestData({ id: match.params.id, mode: 'published' });
  }

  handlePreview = ({ testData }) => {
    const { setTestData, match: { params: { id }}, history, subaccountId } = this.props;
    const query = setSubaccountQuery(subaccountId);

    setTestData({ id, data: testData, mode: 'published' }).then(
      () => history.push(`/templates/preview/${id}/published${query}`)
    );
  };

  getPageProps() {
    const { canModify, handleSubmit, match, subaccountId } = this.props;
    const query = setSubaccountQuery(subaccountId);

    const secondaryActions = [
      {
        content: 'View Draft',
        Component: Link,
        to: `/templates/edit/${match.params.id}${query}`
      },
      {
        content: canModify ? 'Preview & Send' : 'Preview',
        onClick: handleSubmit(this.handlePreview)
      }
    ];

    const breadcrumbAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

    return { secondaryActions, breadcrumbAction, title: `${match.params.id} (Published)` };
  }

  render() {
    const { loading, formName } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page {...this.getPageProps()}>
        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form name={formName} readOnly />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name={formName} readOnly />
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}
