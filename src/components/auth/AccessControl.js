import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Loading } from 'src/components/loading/Loading';
import accessConditionState from 'src/selectors/accessConditionState';

export const AccessControl = function AccessControl({ children, ready, redirect, show }) {
  if (ready && redirect && !show) {
    return <Redirect to={redirect} />;
  }
  if (!ready && redirect) {
    return <Loading />;
  }
  return show ? children : null;
};

const accept = () => true;
const mapStateToProps = (state, { condition = accept, redirect }) => ({
  ready: state.accessControlReady,
  redirect,
  show: condition(accessConditionState(state))
});

export default connect(mapStateToProps)(AccessControl);
