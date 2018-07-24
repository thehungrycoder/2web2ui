import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Panel, UnstyledLink, Button, Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { Typeahead } from 'src/components/typeahead/Typeahead';
import { slugify } from 'src/helpers/string';
// import { NameField, TargetField, EventsRadioGroup, AuthDropDown, BasicAuthFields, OAuth2Fields, ActiveField } from './Fields';

const formName = 'abTestForm';

export class AbTestForm extends Component {

  handleIdFill = (e) => {
    const { change } = this.props;

    const idValue = slugify(e.target.value).replace(new RegExp('[^a-z0-9_-]', 'g'), '');
    change('id', idValue);
  }

  render() {
    const {
      handleSubmit,
      submitText,
      disabled
    } = this.props;

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
                onChange={this.handleIdFill} />
            </Grid.Column>
            <Grid.Column>
              <Field
                name='id'
                component={TextFieldWrapper}
                label='ID'
                helpText={'A Unique ID for your test, we\'ll fill this in for you.'}
              />
            </Grid.Column>
          </Grid>
        </Panel.Section>
        <Panel.Section>
          <Field
            name='default_template_id'
            placeholder='Type to search'
            component={Typeahead}
            results={['template-1', 'template-2']}
            label={'Select this test\'s default template'}
            helpText={<span>We will send this template by default when the test is not running. If you need to create a new template, <UnstyledLink to='#'>head over to the templates page</UnstyledLink>.</span>}/>
          <p></p>
        </Panel.Section>
        <Panel.Section>
          <Button submit primary disabled={disabled}>{submitText}</Button>
        </Panel.Section>
      </form>
    );
  }
}

AbTestForm.defaultProps = {
  newAbTest: false
};

function mapStateToProps(state, props) {
  const abTestValues = props.newAbTest ? {} : state.abTesting.abTest;

  return {
    disabled: props.pristine || props.submitting,
    submitText: props.submitting ? 'Submitting...' : (props.newAbTest ? 'Create A/B Test' : 'Update A/B Test'),
    initialValues: { ...abTestValues }
  };
}

const formOptions = {
  form: formName,
  enableReinitialize: true
};

export default connect(mapStateToProps, {})(reduxForm(formOptions)(AbTestForm));
