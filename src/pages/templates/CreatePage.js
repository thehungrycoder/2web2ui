import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import _ from 'lodash';

// Actions
import { create, getDraft } from 'src/actions/templates';
import { showAlert } from 'src/actions/globalAlert';

// Selectors
import { getTemplateById, cloneTemplate } from 'src/selectors/templates';

// Components
import Form from './components/Form';
import Editor from './components/Editor';
import { Page, Grid } from '@sparkpost/matchbox';
import { Loading } from 'src/components';

const FORM_NAME = 'templateCreate';

export class CreatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldRedirect: false,
      isDuplicating: !!props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isDuplicating) {
      const { match, getDraft } = this.props;
      getDraft(match.params.id).catch((err) => err);
    }
  }

  handleCreate(values) {
    const { create, showAlert } = this.props;
    return create(values)
      .then(() => this.setState({ shouldRedirect: true }))
      .catch((err) => {
        const details = _.get(err, 'response.data.errors[0].description') || err.message;
        return showAlert({ type: 'error', message: 'Could not create template', details: details });
      });
  }

  render() {
    const { id, handleSubmit, submitting, loading } = this.props;

    if (this.state.shouldRedirect) {
      return <Redirect to={`/templates/edit/${id}`} />;
    }

    if (loading) {
      return <Loading />;
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
        title= { this.state.isDuplicating ? 'Duplicate Template' : 'New Template' }>

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
const mapStateToProps = (state, props) => {
  const stateToProps = {
    id: selector(state, 'id'),
    loading: state.templates.getLoading
  };

  const template = getTemplateById(state, props.match.params.id);
  if (_.get(props, 'match.params.id') && !_.isEmpty(template.draft)) {
    const draftTemplate = cloneTemplate(template.draft);
    stateToProps.initialValues = draftTemplate;
  }

  return stateToProps;
};

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

export default connect(mapStateToProps, { create, getDraft, showAlert })(reduxForm(formOptions)(CreatePage));
