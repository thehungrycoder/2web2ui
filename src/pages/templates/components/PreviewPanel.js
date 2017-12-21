import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, Tabs } from '@sparkpost/matchbox';

import PreviewFrame from './PreviewFrame';

export default class PreviewPanel extends Component {
  static defaultProps = {
    text: ''
  }

  static propTypes = {
    html: PropTypes.string.isRequired,
    text: PropTypes.string
  }

  state = {
    contentType: 'HTML'
  }

  onChange = (event) => {
    this.setState({ contentType: event.currentTarget.text });
  }

  render() {
    const tabs = [
      { content: 'HTML', onClick: this.onChange },
      { content: 'Text', onClick: this.onChange }
    ];

    const selectedTabIndex = tabs.findIndex(({ content }) => content === this.state.contentType);

    const contentType = this.state.contentType.toLowerCase();

    // Must wrap text content in <p> to apply style and must be a string for injecting into iframe
    const content = contentType === 'text'
      ? `<p style="white-space: pre-wrap">${this.props[contentType]}</p>`
      : this.props[contentType];

    return (
      <Panel>
        <Panel.Section>
          <Tabs selected={selectedTabIndex} tabs={tabs} />
          <PreviewFrame content={content} key={contentType} />
        </Panel.Section>
      </Panel>
    );
  }
}
