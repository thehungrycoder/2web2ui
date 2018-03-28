/*
  This component is meant to be loaded asynchronously, do not import directly.
  See ../Editor.js for async export
*/
import React, { Component } from 'react';
import { Field } from 'redux-form';
import { contentRequired, validJson } from '../validation';

import { Panel, Tabs } from '@sparkpost/matchbox';
import AceWrapper from './AceWrapper';

import './Editor.scss';
import styles from '../FormEditor.module.scss';

const fields = [
  { content: 'HTML', name: 'content.html', mode: 'html', syntaxValidation: false },
  { content: 'Text', name: 'content.text', mode: 'text', syntaxValidation: false },
  { content: 'Test Data', name: 'testData', mode: 'json', syntaxValidation: true }
];

class Editor extends Component {
  state = {
    selectedTab: 0
  }

  handleTab = (i) => {
    this.setState({ selectedTab: i });
  }

  render() {
    const { readOnly } = this.props;
    const { selectedTab } = this.state;

    const tabs = fields.map(({ content }, i) => ({ content, onClick: () => this.handleTab(i) }));

    return (
      <div className={styles.EditorSection}>
        <Tabs selected={selectedTab} tabs={tabs}/>
        <Panel className={styles.EditorPanel}>
          <Field
            name={fields[selectedTab].name}
            mode={fields[selectedTab].mode}
            syntaxValidation={fields[selectedTab].syntaxValidation}
            component={AceWrapper}
            readOnly={readOnly && selectedTab !== 2}
            validate={[contentRequired, validJson]}
          />
        </Panel>
      </div>
    );
  }
}

export default Editor;
