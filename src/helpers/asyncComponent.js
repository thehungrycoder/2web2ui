/**
 * Idea stolen from link in Create React App docs:
 * https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
 */
import React, { Component } from 'react';

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    state = {
      component: null
    };

    async componentDidMount() {
      this.mounted = true;
      const { default: component } = await importComponent();
      this.mounted && this.setState({ component });
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}
