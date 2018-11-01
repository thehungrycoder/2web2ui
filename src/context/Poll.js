import React, { createContext, Component } from 'react';

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
 *   maxAttempts: 10, Maximum number of times to poll. Default (-1) specifies no limit.
 *   action: () => () The func to call at every interval
 * }
 */

const defaultContext = {
  actions: {}
};

const defaultAction = {
  interval: 1000,
  maxAttempts: -1,
  attempts: 0
};

export const PollContext = createContext(defaultContext);

/**
 * PollContext Provider
 */
class Poll extends Component {
  state = defaultContext;

  poll = (key) => {
    const { action, interval, status, attempts, maxAttempts } = this.state.actions[key];
    const attemptCount = attempts + 1;

    if (status === 'polling') {
      action();
      this.setActionState(key, { attempts: attemptCount });

      if (attemptCount < maxAttempts || maxAttempts === -1) {
        setTimeout(() => this.poll(key), interval);
      } else {
        this.setActionState(key, { status: 'done' });
      }
    }
  }

  start = ({ key, ...args }) => {
    const action = { ...defaultAction, ...args, status: 'polling' };
    this.setActionState(key, action);
    return setTimeout(() => this.poll(key), action.interval);
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
