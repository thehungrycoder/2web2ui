import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import config from 'src/config';

export const AccessControl = function AccessControl({ children, redirect, show }) {
  if (redirect && !show) {
    return <Redirect to={redirect} />;
  }
  return show ? children : null;
};

const accept = () => true;
const mapStateToProps = (state, { condition = accept }) => ({
  show: condition({ state, config })
});

export default connect(mapStateToProps)(AccessControl);
