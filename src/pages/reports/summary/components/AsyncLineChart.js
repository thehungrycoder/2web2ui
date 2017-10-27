import React, { Component } from 'react';
import loadable from 'react-loadable';

const LoadableLineChart = loadable({
  loader: () => import('./LineChart'),
  render(loaded, props) {
    const Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() { //Actual Loading Component goes here
    return <div>Loading...</div>;
  }
});

export default class LineChart extends Component {
  render() {
    return <LoadableLineChart {...this.props}/>;
  }
}
