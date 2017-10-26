import React, { Component } from 'react';
import loadable from 'react-loadable';

const LoadableEditor = loadable({
  loader: () => import('./_Editor'),
  render(loaded, props) {
    console.log(props); //eslint-disable-line
    const Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() { //Actual Loading Component goes here
    return <div>Loading...</div>;
  }
});

export default class Editor extends Component {
  render() {
    return <LoadableEditor {...this.props}/>;
  }
}
