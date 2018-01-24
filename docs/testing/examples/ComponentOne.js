import React from 'react';
import ComponentTwo from './ComponentTwo';

export default class ComponentOne extends React.Component {
  state = {
    message: 'what a cool message',
    submitted: false
  }

  componentDidMount() {
    this.props.fetchData();
  }

  componentWillReceiveProps({ submitted }) {
    if (typeof submitted === 'boolean') {
      this.setState({ submitted });
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState({ message: e.target.value });
  }

  handleSubmit = (values) => {
    this.setState({ submitted: true });
    this.props.submit(values);
  }

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <div>
        <button id='change-message' onClick={this.handleClick}>Change the message</button>
        <h2>{this.state.message}</h2>
        <ComponentTwo onSubmit={this.handleSubmit} />
      </div>
    );
  }
}
