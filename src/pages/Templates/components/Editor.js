import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

// Components
import { Panel, TextField } from '@sparkpost/matchbox';

// TODO use shared component instead of this
const TextFieldWrapper = ({ input, meta: { error }, ...rest }) => (
  <TextField {...rest} {...input} error={error} />
);

class Editor extends Component {
  render () {
    return (
      <Panel sectioned >
        <Field
          name='content.html' id='html'
          component={TextFieldWrapper}
          label='Email Content'
          multiline
          style={{ height: '800px' }}
        />
      </Panel>
    );
  }
}

const mapStateToProps = ({ templates: { activeTemplate } }) => ({
  initialValues: { ...activeTemplate }
});

const formOptions = {
  form: 'templateEdit',
  enableReinitialize: true // required to update initial values from redux state
};

export default connect(mapStateToProps)(reduxForm(formOptions)(Editor));
