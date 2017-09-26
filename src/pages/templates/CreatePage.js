import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
// Actions
import { create } from '../../actions/templates';

// Components
import { Layout } from 'src/components';
import Form from './components/Form';
import Editor from './components/Editor';
import { Page, Grid } from '@sparkpost/matchbox';

const FORM_NAME = 'templateCreate';

class CreatePage extends Component {
  state = {
    shouldRedirect: false
  }

  handleCreate(values) {
    const { create } = this.props;
    return create(values)
      .then(() => this.setState({ shouldRedirect: true }));
  }

  renderPageHeader() {
    const { handleSubmit, submitting } = this.props;

    const primaryAction = {
      content: 'Save Template',
      onClick: handleSubmit((values) => this.handleCreate(values)),
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
        title='New Template'
      />
    );
  }

  render() {
    const { id } = this.props;

    if (this.state.shouldRedirect) {
      return <Redirect to={`/templates/edit/${id}`} />;
    }

    return (
      <Layout.App>
        { this.renderPageHeader() }
        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form newTemplate={true} name={FORM_NAME} />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name={FORM_NAME} />
          </Grid.Column>
        </Grid>
      </Layout.App>
    );
  }
}

const selector = formValueSelector(FORM_NAME);
const mapStateToProps = (state) => ({
  id: selector(state, 'id')
});

const formOptions = {
  form: FORM_NAME
};

export default connect(mapStateToProps, { create })(reduxForm(formOptions)(CreatePage));
