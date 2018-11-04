import React from 'react';
import { Field, Form } from 'redux-form';
import { Button, Grid, Page, Panel } from '@sparkpost/matchbox';
import ContentEditor from 'src/components/contentEditor';
import { RedirectAndAlert } from 'src/components/globalAlert';
import Loading from 'src/components/loading';
import PageLink from 'src/components/pageLink';
import TextFieldWrapper from 'src/components/reduxFormWrappers/TextFieldWrapper';
import SubaccountSection from 'src/components/subaccountSection';
import { maxLength, required } from 'src/helpers/validation';
import DeleteSnippetLink from './components/DeleteSnippetLink';
import IdentifierHelpText from './components/IdentifierHelpText';

export default class EditPage extends React.Component {
  componentDidMount() {
    const { id, subaccountId } = this.props;
    this.props.getSnippet({ id, subaccountId });
  }

  componentWillUnmount() {
    this.props.clearSnippet();
  }

  secondaryActions = [
    {
      Component: (props) => (
        <DeleteSnippetLink {...props} id={this.props.id} subaccountId={this.props.subaccountId} />
      ),
      content: 'Delete',
      to: '/', // needed to render Component
      visible: () => this.props.canModify
    },
    {
      Component: PageLink,
      content: 'Duplicate',
      to: {
        pathname: '/snippets/create',
        state: {
          id: this.props.id,
          subaccountId: this.props.subaccountId
        }
      },
      visible: () => this.props.canModify
    }
  ]

  submitSnippet = ({
    content: { html, text } = {},
    id,
    name,
    subaccount: { id: subaccountId } = {},
    shared_with_subaccounts: sharedWithSubaccounts
  }) => (
    this.props.updateSnippet({ html, id, name, sharedWithSubaccounts, subaccountId, text })
      .then(() => this.props.showAlert({ type: 'success', message: 'Snippet saved' }))
  )

  render() {
    const {
      canModify,
      error,
      handleSubmit,
      hasSubaccounts,
      id,
      loading,
      submitting
    } = this.props;
    const disabled = !canModify || submitting;

    if (error) {
      return <RedirectAndAlert to="/snippets" alert={{ type: 'error', message: error.message }} />;
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title={id}
        breadcrumbAction={{ Component: PageLink, content: 'Snippets', to: '/snippets' }}
        primaryAction={{
          Component: Button,
          content: 'Save Snippet',
          disabled,
          onClick: handleSubmit(this.submitSnippet)
        }}
        secondaryActions={
          this.secondaryActions.filter(({ visible = () => true }) => visible())
        }
      >
        <Form onSubmit={this.submitSnippet}>
          <Grid>
            <Grid.Column xs={12} lg={4}>
              <Panel>
                <Panel.Section>
                  <Field
                    name="name"
                    component={TextFieldWrapper}
                    disabled={disabled}
                    label="Snippet Name"
                    validate={[required, maxLength(64)]}
                  />
                  <Field
                    name="id"
                    component={TextFieldWrapper}
                    disabled={true} // id cannot change after being set
                    helpText={<IdentifierHelpText />}
                    label="Snippet ID"
                  />
                </Panel.Section>
                {hasSubaccounts && (
                  <SubaccountSection newTemplate={false} disabled={disabled} />
                )}
              </Panel>
            </Grid.Column>
            <Grid.Column xs={12} lg={8}>
              <ContentEditor contentOnly={true} readOnly={disabled} />
            </Grid.Column>
          </Grid>
        </Form>
      </Page>
    );
  }
}
