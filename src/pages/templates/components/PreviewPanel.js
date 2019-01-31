import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from '@sparkpost/matchbox';

import PreviewFrame from './PreviewFrame';
import styles from './PreviewPanel.module.scss';

export default class PreviewPanel extends Component {
  static defaultProps = {
    html: '',
    text: '',
    amp_html: ''
  }

  static propTypes = {
    html: PropTypes.string,
    text: PropTypes.string,
    amp_html: PropTypes.string
  }

  state = {
    contentType: 'HTML'
  }

  onChange = (event) => {
    this.setState({ contentType: event.currentTarget.text });
  }

  render() {
    const { isAmpLive } = this.props;
    const tabs = [
      { content: 'HTML', onClick: this.onChange },
      { content: 'Text', onClick: this.onChange }
    ];

    if (isAmpLive) {
      tabs.push({ content: 'AMP HTML', onClick: this.onChange });
    }

    const selectedTabIndex = tabs.findIndex(({ content }) => content === this.state.contentType);
    const contentType = this.state.contentType.toLowerCase().replace(' ', '_');

    // Must wrap text content in <p> to apply style and must be a string for injecting into iframe
    const content = contentType === 'text'
      ? `<p style="white-space: pre-wrap">${this.props[contentType]}</p>`
      : this.props[contentType];

    return (
      <div className="notranslate">
        <div className={styles.PreviewPanel}>
          <Tabs selected={selectedTabIndex} tabs={tabs} />
          <div className={styles.PreviewPanelWrapper}>
            <PreviewFrame content={content} key={contentType} />
          </div>
        </div>
      </div>

    );
  }
}
