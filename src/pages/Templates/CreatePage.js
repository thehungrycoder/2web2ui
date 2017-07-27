import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
// Actions
import { clear, create } from '../../actions/templates';

// Components
import Layout from '../../components/Layout/Layout';
import Form from './components/Form';
import Editor from './components/Editor';
import { Page, Panel, Grid } from '@sparkpost/matchbox';

class CreatePage extends Component {
  state = {
    shouldRedirect: false
  }

  componentDidMount () {
    this.props.clear();
  }

  handleCreate (values) {
    const { create } = this.props;
    return create(values)
      .then(() => {
        this.setState({ shouldRedirect: true });
      });
  }

  renderPageHeader () {
    const { handleSubmit } = this.props;

    const primaryAction = {
      content: 'Save Template',
      onClick: handleSubmit((values) => this.handleCreate(values))
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

  render () {
    const {
      match,
      id,
      loading,
      published,
      handleSubmit,
      submitSucceeded
    } = this.props;

    if (submitSucceeded && this.state.shouldRedirect) {
      return <Redirect to={`/templates/edit/${id}`} />;
    }

    return (
      <Layout.App>
        { this.renderPageHeader() }
        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form newTemplate={true} name='templateCreate' />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name='templateCreate' />
          </Grid.Column>
        </Grid>
      </Layout.App>
    );
  }
}

const selector = formValueSelector('templateCreate');
const mapStateToProps = (state) => ({
  loading: state.templates.getLoading,
  id: selector(state, 'id')
});
const formOptions = {
  form: 'templateCreate'
};

export default connect(mapStateToProps, { create, clear })(reduxForm(formOptions)(CreatePage));
