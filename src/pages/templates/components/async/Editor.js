/* eslint-disable */
/*
  This component is meant to be loaded asynchronously, do not import directly.
  See ../Editor.js for async export
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import { contentRequired, validJson } from '../validation';

// Components
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import { Panel, Tabs } from '@sparkpost/matchbox';

import './Editor.scss';
import styles from '../FormEditor.module.scss';

const AceWrapper = ({ input, mode, meta: { touched, error }, ...rest }) => {
  let value = input.value;

  if (mode === 'json' && typeof value === 'object') {
    value = JSON.stringify(value, null, 2);
  }

  return (
    <div>
      <AceEditor
        mode={mode}
        value={value}
        onChange={input.onChange}
        theme='tomorrow'
        className='TemplateEditor'
        height='900px'
        width='auto'
        tabSize={2}
        fontSize={12}
        cursorStart={1}
        highlightActiveLine
        showPrintMargin={false}
        setOptions={{
          // useWorker: false,
          displayIndentGuides: false
        }}
        editorProps={{ $blockScrolling: true }}
        {...rest} />
      { touched && error ? <span className={styles.Error}>{ error }</span> : null }
    </div>
  );
};

const fields = [
  { content: 'HTML', name: 'content.html', mode: 'html' },
  { content: 'Text', name: 'content.text' },
  { content: 'Test Data', name: 'testData', mode: 'json' }
];

class Editor extends Component {
  state = {
    selectedTab: 0
  }

  handleTab = (i) => {
    this.setState({ selectedTab: i });
  }

  render() {
    const { published, html, text, testData } = this.props;
    const { selectedTab } = this.state;

    const tabs = fields.map(({ content }, i) => ({ content, onClick: () => this.handleTab(i) }));

    return (
      <div className={styles.EditorSection}>
        <Tabs selected={selectedTab} tabs={tabs}/>
        <Panel className={styles.EditorPanel}>
          <Field
            name={fields[selectedTab].name}
            mode={fields[selectedTab].mode}
            component={AceWrapper}
            readOnly={published}
            validate={[
              () => contentRequired(html, text),
              () => validJson(testData)
            ]} />
        </Panel>
      </div>
    );
  }
}

// Select content values so we can validate against them
const mapStateToProps = (state, { name }) => {
  const selector = formValueSelector(name);
  return {
    html: selector(state, 'content.html'),
    text: selector(state, 'content.text'),
    testData: selector(state, 'testData')
  };
};

export default connect(mapStateToProps)(Editor);
