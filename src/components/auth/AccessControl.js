import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import accessConditionState from 'src/selectors/accessConditionState';

export const AccessControl = function AccessControl({ children, redirect, show }) {
  if (redirect && !show) {
    return <Redirect to={redirect} />;
  }
  return show ? children : null;
};

const accept = () => true;
const mapStateToProps = (state, { condition = accept, redirect }) => ({
  redirect: state.accessControlReady && redirect,
  show: condition(accessConditionState(state))
});

export default connect(mapStateToProps)(AccessControl);
