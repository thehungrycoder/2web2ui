import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

// Components
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/theme/tomorrow';
import { Panel } from '@sparkpost/matchbox';

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
      <Panel style={{ height: '100%', position: 'relative', zIndex: '1' }}>
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

const mapStateToProps = (state, { name }) => ({ form: name });

const formOptions = {
  enableReinitialize: true // required to update initial values from redux state
};

export default compose(
  connect(mapStateToProps),
  reduxForm(formOptions)
)(Editor);
