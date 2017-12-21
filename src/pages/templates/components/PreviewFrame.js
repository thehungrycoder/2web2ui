import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './PreviewFrame.module.scss';

// @note This is a port of the previous fd.templates.preview.directive
// @see https://github.com/SparkPost/webui/blob/master/src/app/templates/preview-directive.js
export default class PreviewFrame extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired
  }

  state = {
    height: undefined
  }

  componentDidMount() {
    // Must wait to write content until this.iframe is set after render()
    this.writeContent();
  }

  // Calculate height of loaded content and manually set iframe height to match to avoid
  // a scrollbar
  // @note offsetHeight was used instead of scrollHeight because it is more likely a template
  //   will include a border than pseudo-elements such as :before and :after and removed
  //   border since both metrics don't include it
  // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight
  onLoad = () => {
    const { body } = this.iframe.contentWindow.document;

    body.style.marginBottom = 0;
    body.style.marginTop = 0;

    this.setState({ height: `${body.offsetHeight}px` });
  }

  setRef = (iframe) => { this.iframe = iframe; }

  writeContent() {
    const { document } = this.iframe.contentWindow;

    document.open();
    document.write(this.props.content);
    document.close();
  }

  // @todo Shadow DOM might be a better solution when it has better browser support
  // @see https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM
  // @see https://github.com/Wildhoney/ReactShadow
  render() {
    return (
      <iframe
        className={styles.PreviewFrame}
        height={this.state.height}
        ref={this.setRef}
        onLoad={this.onLoad}
        title="preview email template frame"
      />
    );
  }
}
