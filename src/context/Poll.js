import React, { createContext, Component } from 'react';
import moment from 'moment';

/**
 * PollContext
 * A simple polling service that persists between route changes
 * @prop startPolling func
 * @prop stoptPolling func
 *
 * @example
 * <PollContext.Consumer>
 *   {({ startPolling, stopPolling }) =>(
 *    <button onClick={() => startPolling(action)} />
 *    <button onClick={() => stopPolling(action.key)} />
 *   )}
 * </PollContext.Consumer>
 *
 * Action model:
 * {
 *   key: 'identifier', A string to represent this action
 *   interval: 1000, Time in ms between each poll
 *   duration: 5000, Time in ms to stop polling
 *   action: () => () The func to call at every interval until duration has reached
 * }
 */

const defaultContext = {
  actions: {}
};

const defaultAction = {
  interval: 1000,
  duration: 2000
};

export const PollContext = createContext(defaultContext);

/**
 * PollContext Provider
 */
class Poll extends Component {
  state = defaultContext;

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
    const { key, interval } = action;

    this.setActionState(key, {
      ...defaultAction,
      ...action,
      startTime: moment(),
      status: 'polling'
    });

    return setTimeout(() => this.poll(key), interval);
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
    const value = {
      actions: this.state.actions,
      startPolling: this.start,
      stopPolling: this.stop
    };

    return (
      <PollContext.Provider value={value}>
        {/* Only components that are rendered under this tree will be able to "consume" */}
        {this.props.children}
      </PollContext.Provider>
    );
  }
}

export default Poll;
