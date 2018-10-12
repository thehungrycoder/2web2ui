import React from 'react';
import { connect } from 'react-redux';
import { Field, Form, reduxForm, SubmissionError } from 'redux-form';
import { Button, Grid, Page, Panel } from '@sparkpost/matchbox';
import { createSnippet } from 'src/actions/snippets';
import ExternalLink from 'src/components/externalLink/ExternalLink';
import TextFieldWrapper from 'src/components/reduxFormWrappers/TextFieldWrapper';
import { LINKS } from 'src/constants';
import { slugify } from 'src/helpers/string';
import { maxLength, required, slug } from 'src/helpers/validation';

export class CreatePage extends React.Component {
  componentDidUpdate() {
    if (this.props.submitSucceeded) {
      this.props.history.push('/snippets');
    }
  }

  fillIdField = (event) => {
    this.props.change('id', slugify(event.target.value));
  }

  submitSnippet = async (values) => {
    try {
      await this.props.createSnippet(values);
    } catch (error) {
      throw new SubmissionError({ _error: error.message }); // only way to tell redux-form submit failed
    }
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <Page
        title="New Snippet"
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
                    helpText={
                      <React.Fragment>
                        Use this unique identifier to {(
                          <ExternalLink to={LINKS.SNIPPET_SUBSTITUTION_REFERENCE}>
                            reference your snippet in a template
                          </ExternalLink>
                        )}
                      </React.Fragment>
                    }
                    label="Snippet ID"
                    validate={[required, slug, maxLength(64)]}
                  />
                </Panel.Section>
                <Panel.Section>
                  Subaccounts
                </Panel.Section>
              </Panel>
            </Grid.Column>
            <Grid.Column xs={12} lg={8}>
              Editor
            </Grid.Column>
          </Grid>
        </Form>
      </Page>
    );
  }
}

const formOptions = {
  form: 'createSnippetForm'
};

const mapStateToDispatch = {
  createSnippet
};

const mapStateToProps = (state, props) => ({});

export default connect(mapStateToProps, mapStateToDispatch)(reduxForm(formOptions)(CreatePage));
