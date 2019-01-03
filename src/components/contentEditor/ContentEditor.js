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
    content: 'AMP HTML',
    name: 'content.amp_html',
    mode: 'html',
    syntaxValidation: false,
    show: ({ isAmpLive }) => isAmpLive
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
  normalize = (value) => {
    if (!value || value.trim() === '') {
      return '';
    }

    return value;
  }

  // note, must handle null template parts
  requiredHtmlOrText = (value, { content: { html, text } = {}}) => {
    // return validation error if both parts are falsy or empty
    if (!this.normalize(html) && !this.normalize(text)) {
      return 'HTML or Text is required';
    }
  }

  // note, must handle null template parts
  requiredHtmlTextOrAmp = (value, { content: { html, text, amp_html } = {}}) => {
    // return validation error if both parts are falsy or empty
    if (!this.normalize(html) && !this.normalize(text) && !this.normalize(amp_html)) {
      return 'HTML, AMP HTML, or Text is required';
    }
  }

  validTestDataJson = (value, { testData }) => {
    if (!this.props.contentOnly && json(testData)) {
      return 'Invalid Test Data';
    }
  }

  render() {
    const { readOnly, isAmpLive, contentOnly } = this.props;
    const { selectedTab } = this.state;
    const visibleFields = fields.filter((field) => field.show(this.props));
    const tabs = visibleFields.map(({ content }, index) => ({ content, onClick: () => this.handleTab(index) }));

    // Templates require HTML or Text. Snippets require HTML, AMP HTML, or Text.
    const requiredContentValidator = isAmpLive && contentOnly ? this.requiredHtmlTextOrAmp : this.requiredHtmlOrText;

    return (
      <div className={styles.EditorSection}>
        <Tabs selected={selectedTab} tabs={tabs} />
        {this.props.action && (
          <div className={styles.Action}>{this.props.action}</div>
        )}
        <Panel className={styles.EditorPanel}>
          <Field
            component={AceWrapper}
            mode={visibleFields[selectedTab].mode}
            name={visibleFields[selectedTab].name}
            normalize={this.normalize}
            readOnly={readOnly && selectedTab !== 2}
            syntaxValidation={visibleFields[selectedTab].syntaxValidation}
            validate={[requiredContentValidator, this.validTestDataJson]}
          />
        </Panel>
      </div>
    );
  }
}

export default ContentEditor;
