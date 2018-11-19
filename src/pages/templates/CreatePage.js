import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Components
import ContentEditor from 'src/components/contentEditor';
import Form from './components/containers/Form.container';
import { Page, Grid } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import ImportSnippetLink from './components/ImportSnippetLink';

export default class CreatePage extends Component {
  componentDidMount() {
    if (this.props.cloneId) {
      const { getDraft } = this.props;
      return getDraft(this.props.cloneId);
    }
  }

  handleCreate = (values) => {
    const { create, id, history, subaccountId } = this.props;

    return create(values)
      .then(() => history.push(`/templates/edit/${id}${setSubaccountQuery(subaccountId)}`));
  }

  render() {
    const { cloneId, handleSubmit, submitting, loading, formName, subaccountId } = this.props;

    if (loading) {
      return <Loading />;
    }

    const primaryAction = {
      content: 'Save Template',
      onClick: handleSubmit(this.handleCreate),
      disabled: submitting
    };

    const backAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

    return (
      <Page
        primaryAction={primaryAction}
        breadcrumbAction={backAction}
        title={cloneId ? 'Duplicate Template' : 'New Template'}>

        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form newTemplate name={formName} subaccountId={subaccountId}/>
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <ContentEditor action={<ImportSnippetLink />} />
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}
