import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
// Actions
import { create } from '../../actions/templates';

// Components
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

  render() {
    const { id, handleSubmit, submitting } = this.props;

    if (this.state.shouldRedirect) {
      return <Redirect to={`/templates/edit/${id}`} />;
    }

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
        title='New Template' >
        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form newTemplate={true} name={FORM_NAME} />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name={FORM_NAME} />
          </Grid.Column>
        </Grid>
      </Page>
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
