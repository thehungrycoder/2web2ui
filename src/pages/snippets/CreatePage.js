import React from 'react';
import { connect } from 'react-redux';
import { Field, Form, reduxForm } from 'redux-form';
import { Button, Grid, Page, Panel } from '@sparkpost/matchbox';
import { createSnippet, getSnippet } from 'src/actions/snippets';
import { getSubaccount } from 'src/actions/subaccounts';
import ContentEditor from 'src/components/contentEditor';
import Loading from 'src/components/loading';
import PageLink from 'src/components/pageLink';
import TextFieldWrapper from 'src/components/reduxFormWrappers/TextFieldWrapper';
import SubaccountSection from 'src/components/subaccountSection';
import { slugify } from 'src/helpers/string';
import { maxLength, required, slug } from 'src/helpers/validation';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import IdentifierHelpText from './components/IdentifierHelpText';

export class CreatePage extends React.Component {
  componentDidMount() {
    // Sent here via duplicate button
    if (this.props.location.state) {
      const { id, subaccount_id } = this.props.location.state;
      this.props.getSnippet({ id, subaccountId: subaccount_id });
    }
  }

  componentDidUpdate() {
    if (this.props.submitSucceeded) {
      this.props.history.push('/snippets');
    }
  }

  fillIdField = (event) => {
    this.props.change('id', slugify(event.target.value));
  }

  submitSnippet = ({
    assignTo,
    content: { html, text } = {},
    id,
    name,
    subaccount: { id: subaccountId } = {}
  }) => (
    this.props.createSnippet({
      html,
      id,
      name,
      sharedWithSubaccounts: assignTo === 'shared',
      subaccountId,
      text
    })
  )

  render() {
    const { handleSubmit, hasSubaccounts, submitting, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title="New Snippet"
        breadcrumbAction={{ Component: PageLink, content: 'Snippets', to: '/snippets' }}
        primaryAction={{
          Component: Button,
          content: 'Create Snippet',
          onClick: handleSubmit(this.submitSnippet)
        }}
      >
        <Form onSubmit={this.submitSnippet}>
          <Grid>
            <Grid.Column xs={12} lg={4}>
              <Panel>
                <Panel.Section>
                  <Field
                    name="name"
                    component={TextFieldWrapper}
                    disabled={submitting}
                    label="Snippet Name"
                    onChange={this.fillIdField}
                    validate={[required, maxLength(64)]}
                  />
                  <Field
                    name="id"
                    component={TextFieldWrapper}
                    disabled={submitting}
                    helpText={<IdentifierHelpText />}
                    label="Snippet ID"
                    validate={[required, slug, maxLength(64)]}
                  />
                </Panel.Section>
                {hasSubaccounts && <SubaccountSection newTemplate={true} disabled={submitting} />}
              </Panel>
            </Grid.Column>
            <Grid.Column xs={12} lg={8}>
              <ContentEditor contentOnly={true} />
            </Grid.Column>
          </Grid>
        </Form>
      </Page>
    );
  }
}

const formOptions = {
  form: 'createSnippetForm',
  enableReinitialize: true
};

const mapDispatchToProps = {
  createSnippet,
  getSnippet,
  getSubaccount
};

const mapStateToProps = (state, props) => ({
  hasSubaccounts: hasSubaccounts(state),
  initialValues: getInitialValues(state, props),
  loading: state.snippets.loading
});

const getInitialValues = (state, props) => {
  if (state.snippets.snippet) {
    const { id, name, content, shared_with_subaccounts } = state.snippets.snippet;
    const { subaccount_id } = props.location.state;
    return {
      id: `${id}-copy`,
      name: `${name} Copy`,
      subaccount: { id: subaccount_id },
      assignTo: subaccount_id ? 'subaccount' : shared_with_subaccounts ? 'shared' : 'master',
      content
    };
  } else {
    return {
      assignTo: 'master'
    };
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(formOptions)(CreatePage));
