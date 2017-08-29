import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

class ScrollToTop extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

export default ScrollToTop;
