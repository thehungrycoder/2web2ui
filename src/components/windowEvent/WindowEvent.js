import { Component } from 'react';

/**
 * Adds and removes events for you
 * Usage:
 * <WindowEvent event='keydown' handler={this.handleKeyDown} />
 */
class WindowEvent extends Component {
  componentDidMount() {
    this.addEvent();
  }

  componentWillUpdate() {
    this.removeEvent();
  }

  componentDidUpdate() {
    this.addEvent();
  }

  componentWillUnmount() {
    this.removeEvent();
  }

  render() {
    return null;
  }

  addEvent() {
    const { event, handler } = this.props;
    window.addEventListener(event, handler);
  }

  removeEvent() {
    const { event, handler } = this.props;
    window.removeEventListener(event, handler);
  }
}

export default WindowEvent;
