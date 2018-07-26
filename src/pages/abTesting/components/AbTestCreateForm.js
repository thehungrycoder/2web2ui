import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Panel, UnstyledLink, Button, Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { TemplateTypeaheadWrapper, SubaccountTypeaheadWrapper } from 'src/components/reduxFormWrappers';
import { slugify } from 'src/helpers/string';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { required, maxLength, abTestId } from 'src/helpers/validation';

const formName = 'abTestCreateForm';

export class AbTestCreateForm extends Component {

  handleIdFill = (e) => {
    const { change } = this.props;
    const idValue = slugify(e.target.value).replace(new RegExp('[^a-z0-9_-]', 'g'), '');
    change('id', idValue);
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting
    } = this.props;

    const disabled = pristine || submitting;
    const submitText = submitting ? 'Submitting...' : 'Create New Test';

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <p>Give your test a name and an ID. You will need to use this ID when specifying an A/B test in your transmission's content JSON object.</p>
          <Grid>
            <Grid.Column>
              <Field
                name='name'
                component={TextFieldWrapper}
                label='Give your test a name'
                onChange={this.handleIdFill}
                validate={[required, maxLength(64)]}
              />
            </Grid.Column>
            <Grid.Column>
              <Field
                name='id'
                component={TextFieldWrapper}
                label='ID'
                helpText={'A Unique ID for your test, we\'ll fill this in for you.'}
                validate={[required, abTestId, maxLength(64)]}
              />
            </Grid.Column>
          </Grid>
        </Panel.Section>
        {hasSubaccounts
          ? <Panel.Section>
            <Field
              name='subaccount'
              component={SubaccountTypeaheadWrapper}
              label='Select the subaccount to be used for this test'
              placeholder='Master Account'
              helpText='Leaving this field blank will permanently assign the A/B test to the master account.'
            />
          </Panel.Section>
          : null}
        <Panel.Section>
          <Field
            name='default_variant'
            component={TemplateTypeaheadWrapper}
            label={'Select this test\'s default template'}
            placeholder='Type to search'
            helpText={<span>We will send this template by default when the test is not running. If you need to create a new template, <UnstyledLink to='#'>head over to the templates page</UnstyledLink>.</span>}
            validate={required}
          />
          <p></p>
        </Panel.Section>
        <Panel.Section>
          <Button submit primary disabled={disabled}>{submitText}</Button>
        </Panel.Section>
      </form>
    );
  }
}

AbTestCreateForm.defaultProps = {};

function mapStateToProps(state, props) {
  return {
    initialValues: {}
  };
}

const formOptions = {
  form: formName,
  enableReinitialize: true
};

export default connect(mapStateToProps, {})(reduxForm(formOptions)(AbTestCreateForm));
