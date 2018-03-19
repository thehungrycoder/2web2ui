import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './PreviewFrame.module.scss';

// Manually pad to avoid scrollbars
const PADDING = 5;

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
  // @see http://www.dyn-web.com/tutorials/iframes/height/
  onLoad = () => {
    const { body, documentElement: html } = this.iframe.contentDocument;
    const height = Math.max(
      body.offsetHeight,
      body.scrollHeight,
      html.clientHeight,
      html.offsetHeight,
      html.scrollHeight
    );

    // Avoid loading links in iframe
    const anchorHTMLCollection = this.iframe.contentDocument.getElementsByTagName('a');

    // ...because DOM collections only array-like
    const anchors = [...anchorHTMLCollection];
    anchors.forEach((a) => a.setAttribute('target', '_parent'));

    this.setState({ height: `${height + PADDING}px` });
  }

  setRef = (iframe) => { this.iframe = iframe; }

  writeContent() {
    const { contentDocument } = this.iframe;

    contentDocument.open();
    contentDocument.write(this.props.content);
    contentDocument.close();
  }

  // The sandboxed iframe enables an extra set of security restriction.
  // The "allow-same-origin" restriction must be lifted to load the content from the same origin.
  // The "allow-top-navigation-by-user-activation" restriction must be lifted to work in
  // conjunction with the target override in .onLoad to avoid loading links in the iframe,
  // instead loading subsequent pages in the current browser tab for a better user experience.
  //
  // @todo srcDoc or Shadow DOM would be better solutions if they had better browser support
  // @see https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM
  // @see https://github.com/Wildhoney/ReactShadow
  // @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox
  // @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-srcdoc
  render() {
    return (
      <iframe
        className={styles.PreviewFrame}
        height={this.state.height}
        ref={this.setRef}
        onLoad={this.onLoad}
        sandbox="allow-same-origin allow-top-navigation-by-user-activation"
        title="preview email template frame"
      />
    );
  }
}
