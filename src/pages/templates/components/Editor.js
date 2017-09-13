import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

// Components
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import { Panel, Tabs } from '@sparkpost/matchbox';

import './Editor.scss';
import styles from './FormEditor.module.scss';

const AceWrapper = ({ input, ...rest }) => (
  <AceEditor
    mode={input.name === 'test' ? 'json' : 'html'}
    theme='tomorrow'
    name='emailContent'
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
      showInvisibles: true,
      displayIndentGuides: false
    }}
    {...rest}
    {...input}
  />
);

class Editor extends Component {
  state = {
    selectedTab: 0
  }

  fieldNames = ['content.html', 'text', 'test']

  handleTab = (i) => {
    this.setState({ selectedTab: i });
  }

  render() {
    const { published } = this.props;
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
            readOnly={published} />
        </Panel>
      </div>
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
