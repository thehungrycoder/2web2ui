import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

// Actions
import { getPublished } from '../../actions/templates';

// Selectors
import { getTemplateById } from 'src/selectors/templates';

// Components
import Form from './components/Form';
import Editor from './components/Editor'; // async
import { Loading } from 'src/components';
import { Page, Grid } from '@sparkpost/matchbox';

const FORM_NAME = 'templatePublished';

class PublishedPage extends Component {
  state = {
    shouldRedirectToPublished: false
  };

  componentWillMount() {
    const { match, getPublished } = this.props;
    getPublished(match.params.id);
  }

  getPageProps() {
    const { match } = this.props;

    const secondaryActions = [
      {
        content: 'View Draft',
        Component: Link,
        to: `/templates/edit/${match.params.id}`
      },
      {
        content: 'Preview & Send',
        disabled: true
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
    const { loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page {...this.getPageProps()}>
        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form name={FORM_NAME} published />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name={FORM_NAME} published />
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.templates.getLoading,
  initialValues: getTemplateById(state, props).published
});

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

export default connect(mapStateToProps, { getPublished })(reduxForm(formOptions)(PublishedPage));
