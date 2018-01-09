import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { getPublished, getTestData } from 'src/actions/templates';
import { selectTemplateById, selectTemplateTestData } from 'src/selectors/templates';

import Form from './components/Form';
import Editor from './components/Editor'; // async
import { Loading } from 'src/components';
import { Page, Grid } from '@sparkpost/matchbox';

const FORM_NAME = 'templatePublished';

export class PublishedPage extends Component {
  componentWillMount() {
    const { match, getPublished, getTestData } = this.props;
    getPublished(match.params.id);
    getTestData({ id: match.params.id, mode: 'published' });
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
        Component: Link,
        to: `/templates/preview/${match.params.id}/published`
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
    if (this.props.loading) {
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
  initialValues: {
    testData: selectTemplateTestData(state),
    ...selectTemplateById(state, props).published
  }
});

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

export default connect(mapStateToProps, { getPublished, getTestData })(reduxForm(formOptions)(PublishedPage));
