import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

// Components
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/theme/tomorrow';
import { Panel, Button } from '@sparkpost/matchbox';

import './Editor.scss';
import styles from './FormEditor.module.scss';

const AceWrapper = ({ input, ...rest }) => (
  <AceEditor
    mode='html'
    theme='tomorrow'
    name='emailContent'
    className='TemplateEditor'
    height='900px'
    width='auto'
    style={{ marginBottom: '-18px' }}
    tabSize={2}
    fontSize={12}
    cursorStart={1}
    highlightActiveLine
    showPrintMargin={false}
    setOptions={{
      displayIndentGuides: false
    }}
    {...rest}
    {...input}
  />
);

class Editor extends Component {
  render() {
    const { published } = this.props;
    return (
      <Panel className={styles.EditorPanel}>
        <Panel.Section>
          <Button size='small'>Test Data</Button>
        </Panel.Section>
        <Field
          name='content.html'
          component={AceWrapper}
          readOnly={published} />
      </Panel>
    );
  }
}

const mapStateToProps = (state, { name }) => ({ form: name });
const formOptions = {
  enableReinitialize: true
};

export default compose(
  connect(mapStateToProps),
  reduxForm(formOptions)
)(Editor);
