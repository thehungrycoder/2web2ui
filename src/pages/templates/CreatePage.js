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

const FORM_NAME = 'templateCreate';

class CreatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldRedirect: false,
      isDuplicating: !!props.match.params.cloneFrom
    };
  }

  componentDidMount() {
    const { match, getDraft } = this.props;

    getDraft(match.params.cloneFrom).catch((err) => err);
  }

  componentDidUpdate() {
    if (!this.state.isDuplicating) {
      return;
    }

    const { loading, template, showAlert } = this.props;

    if (loading || !template) {
      return;
    }

    const { draft = {}} = template;

    if (!Object.keys(draft).length) {
      this.setState({ redirectTo: '/templates/' }); // Redirect if no draft or published found
      showAlert({ type: 'error', message: 'Could not find template' });
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
    const { id, handleSubmit, submitting, match } = this.props;

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
        title= { match.params.cloneFrom ? 'Duplicate Template' : 'New Template' }>

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
  const id = selector(state, 'id');
  const template = getTemplateById(state, props.match.params.cloneFrom);

console.log(template); //eslint-disable-line
  if (_.get(props, 'match.params.cloneFrom') && !_.isEmpty(template.draft)) {
    const drfatTemplate = cloneTemplate(template.draft);
    return {
      id: id,
      loading: state.templates.getLoading,
      initialValues: drfatTemplate
    };
  } else {
    return {
      id: id
    };
  }
};

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

export default connect(mapStateToProps, { create, getDraft, showAlert })(reduxForm(formOptions)(CreatePage));
