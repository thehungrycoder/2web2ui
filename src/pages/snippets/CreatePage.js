import React from 'react';
import { Field, Form } from 'redux-form';
import { Button, Grid, Page, Panel } from '@sparkpost/matchbox';
import ContentEditor from 'src/components/contentEditor';
import Loading from 'src/components/loading';
import PageLink from 'src/components/pageLink';
import TextFieldWrapper from 'src/components/reduxFormWrappers/TextFieldWrapper';
import SubaccountSection from 'src/components/subaccountSection';
import { slugify } from 'src/helpers/string';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { maxLength, required, slug } from 'src/helpers/validation';
import IdentifierHelpText from './components/IdentifierHelpText';

export default class CreatePage extends React.Component {
  componentDidMount() {
    const { snippetToDuplicate, getSnippet } = this.props;

    if (snippetToDuplicate) {
      getSnippet(snippetToDuplicate);
    }
  }

  componentWillUnmount() {
    this.props.clearSnippet(); // loaded for duplicate
  }

  fillIdField = (event) => {
    this.props.change('id', slugify(event.target.value));
  }

  submitSnippet = ({
    assignTo,
    content: { html, text, amp_html } = {},
    id,
    name,
    subaccount
  }) => {
    // must handle when subaccount is set to null by SubaccountSection
    const subaccountId = subaccount ? subaccount.id : undefined;
    const { createSnippet, history, isAmpLive } = this.props;

    return createSnippet({
      html,
      id,
      name,
      sharedWithSubaccounts: assignTo === 'shared',
      subaccountId,
      text,
      amp_html: isAmpLive ? amp_html : undefined
    }).then(() => {
      history.push(`/snippets/edit/${id}${setSubaccountQuery(subaccountId)}`);
    });
  }

  render() {
    const { snippetToDuplicate, handleSubmit, hasSubaccounts, loading, submitting, isAmpLive } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title={snippetToDuplicate ? 'Duplicate Snippet' : 'New Snippet'}
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
              <ContentEditor contentOnly={true} isAmpLive={isAmpLive} />
            </Grid.Column>
          </Grid>
        </Form>
      </Page>
    );
  }
}
