import React from 'react';
import { connect } from 'react-redux';
import selectAccessConditionState from 'src/selectors/accessConditionState';

export const defaultCase = () => true;

export const Case = ({ children }) => children;
Case.displayName = 'Case';

/**
 * Returns the first child whose condition prop returns true
 *
 * Patterned after the React Router <Switch> element
 */
export const ConditionSwitch = function ({ children, ready, accessConditionState }) {
  if (!ready) {
    return null;
  }

  let output = null;

  React.Children.forEach(children, (child) => {
    const { props = {}} = child;
    if (
      output === null &&
      typeof props.condition === 'function' &&
      props.condition(accessConditionState)
    ) {
      output = child;
    }
  });

  return output;
};

const mapStateToProps = (state, { wait = true }) => ({
  ready: !wait || state.accessControlReady,
  accessConditionState: selectAccessConditionState(state)
});

export default connect(mapStateToProps)(ConditionSwitch);
