import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

// Components
import Form from './components/containers/Form.container';
import Editor from './components/Editor'; // async
import { Page, Grid } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import { getSubaccountQuery } from 'src/helpers/templates';

export default class CreatePage extends Component {
  componentDidMount() {
    if (this.props.cloneId) {
      const { getDraft } = this.props;
      return getDraft(this.props.cloneId);
    }
  }

  handleCreate = (values) => {
    const { create, showAlert, id, history, subaccountId } = this.props;

    return create(values)
      .then(() => history.push(`/templates/edit/${id}${getSubaccountQuery(subaccountId)}`))
      .catch((err) => {
        const details = _.get(err, 'response.data.errors[0].description') || err.message;
        return showAlert({ type: 'error', message: 'Could not create template', details: details });
      });
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
        title={ cloneId ? 'Duplicate Template' : 'New Template' }>

        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form newTemplate name={formName} subaccountId={subaccountId}/>
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name={formName} />
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}
