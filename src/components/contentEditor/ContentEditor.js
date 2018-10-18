import React from 'react';
import { Field } from 'redux-form';
import { Panel, Tabs } from '@sparkpost/matchbox';
import { json } from 'src/helpers/validation';
import AceWrapper from './AceWrapper';

import './ContentEditor.scss';
import styles from './ContentEditor.module.scss';

const fields = [
  {
    content: 'HTML',
    mode: 'html',
    name: 'content.html',
    syntaxValidation: false,
    show: () => true
  },
  {
    content: 'Text',
    name: 'content.text',
    mode: 'text',
    syntaxValidation: false,
    show: () => true
  },
  {
    content: 'Test Data',
    name: 'testData',
    mode: 'json',
    syntaxValidation: true,
    show: ({ contentOnly }) => !contentOnly
  }
];

class ContentEditor extends React.Component {
  state = {
    selectedTab: 0
  }

  handleTab = (index) => {
    this.setState({ selectedTab: index });
  }


  // note, create/update snippet requests will fail if either part only contains whitespace
  normalize = (value = '') => {
    if (value.trim() === '') {
      return '';
    }

    return value;
  }

  requiredHtmlOrText = (value, { content: { html = '', text = '' } = {}}) => {
    if (html.trim() === '' && text.trim() === '') {
      return 'HTML or Text is required';
    }
  }

  validTestDataJson = (value, { testData }) => {
    if (!this.props.contentOnly && json(testData)) {
      return 'Invalid Test Data';
    }
  }

  render() {
    const { readOnly } = this.props;
    const { selectedTab } = this.state;

    const tabs = fields
      .filter((field) => field.show(this.props))
      .map(({ content }, index) => ({ content, onClick: () => this.handleTab(index) }));

    return (
      <div className={styles.EditorSection}>
        <Tabs selected={selectedTab} tabs={tabs} />
        <Panel className={styles.EditorPanel}>
          <Field
            component={AceWrapper}
            mode={fields[selectedTab].mode}
            name={fields[selectedTab].name}
            normalize={this.normalize}
            readOnly={readOnly && selectedTab !== 2}
            syntaxValidation={fields[selectedTab].syntaxValidation}
            validate={[this.requiredHtmlOrText, this.validTestDataJson]}
          />
        </Panel>
      </div>
    );
  }
}

export default ContentEditor;
