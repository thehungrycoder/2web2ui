import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import { contentRequired } from './validation';

// Components
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import { Panel, Tabs } from '@sparkpost/matchbox';

import './Editor.scss';
import styles from './FormEditor.module.scss';

const AceWrapper = ({ input, meta: { touched, error }, ...rest }) => (
  <div>
    <AceEditor
      mode={input.name !== 'test' ? 'html' : 'json'}
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
        useWorker: false,
        displayIndentGuides: false
      }}
      editorProps={{ $blockScrolling: true }}
      value={input.value}
      onChange={input.onChange}
      {...rest}
    />
    { touched && error ? <span className={styles.Error}>{ error }</span> : null }
  </div>
);

class Editor extends Component {
  state = {
    selectedTab: 0
  }

  fieldNames = ['content.html', 'content.text', 'test']

  handleTab = (i) => {
    this.setState({ selectedTab: i });
  }

  render() {
    const { published, html, text } = this.props;
    const tabs = [
      { content: 'HTML', onClick: () => this.handleTab(0) },
      { content: 'Text', onClick: () => this.handleTab(1) },
      { content: 'Test Data', onClick: () => this.handleTab(2) }
    ];

    return (
      <div className={styles.EditorSection}>
        <Tabs selected={this.state.selectedTab} tabs={tabs}/>
        <Panel className={styles.EditorPanel}>
          <Field
            name={this.fieldNames[this.state.selectedTab]}
            component={AceWrapper}
            readOnly={published}
            validate={() => contentRequired(html, text)} />
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
    text: selector(state, 'content.text')
  };
};

export default connect(mapStateToProps)(Editor);
