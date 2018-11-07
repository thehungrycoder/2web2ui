import React, { createContext, Component } from 'react';
import _ from 'lodash';

/**
 * PollContext
 * A simple polling service that persists between route changes
 * @prop startPolling func
 * @prop stoptPolling func
 *
 * @example
 * <PollContext.Consumer>
 *   {({ startPolling, stopPolling }) => [
 *    <button onClick={() => startPolling(action)} />,
 *    <button onClick={() => stopPolling(action.key)} />
 *   ]}
 * </PollContext.Consumer>
 *
 * Action model:
 * {
 *   key: 'identifier', A string to represent this action
 *   interval: 1000, Time in ms between each poll
 *   maxAttempts: 10, Maximum number of times to poll. Default (-1) specifies no limit.
 *   maxConsecutiveErrors: If action is a promise, the number of attempts before being stopped
 *   action: () => () The func to call at every interval
 * }
 */

const defaultContext = {
  actions: {}
};

const defaultAction = {
  attempts: 0,
  interval: 1000,
  maxAttempts: -1,
  consecutiveErrors: 0,
  maxConsecutiveErrors: 2
};

export const PollContext = createContext(defaultContext);

/**
 * PollContext Provider
 */
class Poll extends Component {
  state = defaultContext;

  isPolling = (key) => {
    const { actions } = this.state;
    return actions[key] && actions[key].status === 'polling';
  }

  poll = async (key) => {
    const { action, interval, status, attempts, maxAttempts, consecutiveErrors, maxConsecutiveErrors } = _.get(this.state, `actions[${key}]`, {});

    const attemptCount = attempts + 1;
    let errCount = 0;

    if (status !== 'polling') {
      return;
    }

    try {
      await action();
    } catch (error) {
      errCount = consecutiveErrors + 1;

      if (errCount > maxConsecutiveErrors) {
        this.setActionState(key, { attempts: attemptCount, consecutiveErrors: errCount, status: 'failed' });
        return;
      }
    }

    this.setActionState(key, { attempts: attemptCount, consecutiveErrors: errCount });

    if (attemptCount < maxAttempts || maxAttempts === -1) {
      setTimeout(() => this.poll(key), interval);
    } else {
      this.setActionState(key, { status: 'done' });
    }
  }

  start = ({ key, ...args }) => {
    const action = { ...defaultAction, ...args, status: 'polling' };

    if (!this.isPolling(key)) {
      this.setActionState(key, action);
      setTimeout(() => this.poll(key), action.interval);
    }
  };

  stop = (key) => {
    if (this.isPolling(key)) {
      this.setActionState(key, { status: 'stopped' });
    }
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
