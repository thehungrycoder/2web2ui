import React, { createContext, Component } from 'react';
import store from 'src/store';
import moment from 'moment';
import _ from 'lodash';

const defaultContext = {};
const defaultAction = {
  interval: 5000,
  duration: 10000
};

export const PollContext = createContext(defaultContext);

/**
 * PollContext Provider
 * A simple polling service that persists between route changes
 * @prop startPolling func
 * @prop stoptPolling func
 */
class Poll extends Component {
  state = defaultContext;

  componentDidMount() {
    this.setState({
      actions: {},
      startPolling: this.start,
      stopPolling: this.stop,
    });
  }

  poll = (key) => {
    const { action, duration, startTime, interval, status } = this.state.actions[key];

    if (status === 'polling') {
      action();

      if (moment().diff(moment(startTime)) < duration) {
        setTimeout(() => this.poll(key), (interval));
      } else {
        this.setActionState(key, { status: 'done' });
      }
    }
  }

  start = (action) => {
    const { key, interval, alert } = action;

    this.setActionState(key, {
      ...defaultAction,
      ...action,
      startTime: new Date(),
      status: 'polling'
    });

    setTimeout(() => this.poll(key), (interval));
  };

  stop = (key) => {
    this.setActionState(key, { status: 'stopped' });
  };

  setActionState = (actionKey, values) => {
    this.setState({
      actions: {
        ...this.state.actions,
        [actionKey]: {
          ...this.state.actions[actionKey],
          ...values
        }
      }
    });
  }

  render() {
    return (
      <PollContext.Provider value={this.state}>
        {/* Only components that are rendered under this tree will be able to "consume" */}
        {this.props.children}
      </PollContext.Provider>
    );
  }
}

export default Poll;
