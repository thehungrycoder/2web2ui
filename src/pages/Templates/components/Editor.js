import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

// Components
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/theme/tomorrow';
import { Panel, TextField } from '@sparkpost/matchbox';

// TODO use shared component instead of this
const TextFieldWrapper = ({ input, meta: { error }, ...rest }) => (
  <TextField {...rest} {...input} error={error} />
);

const AceWrapper = ({ input, ...rest }) => (
  <AceEditor
    mode='html'
    theme='tomorrow'
    name='emailContent'
    height='100%'
    width='auto'
    tabSize={2}
    fontSize={11}
    style={{ maxHeight: '100%' }}
    markers={[]}
    cursorStart={1}
    {...input}
  />
);

class Editor extends Component {
  render () {
    return (
      <Panel style={{ height: '100%' }}>
        <Panel.Section style={{ height: '100%' }}>
          <Field
            name='content.html'
            component={AceWrapper}
          />
        </Panel.Section>
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
