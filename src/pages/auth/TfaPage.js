import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Panel } from '@sparkpost/matchbox';
import { CenteredLogo } from 'src/components';
import TfaForm from './components/TfaForm';
import RedirectAfterLogin from './components/RedirectAfterLogin';
import { AUTH_ROUTE } from 'src/constants';

export const TfaPage = ({ loggedIn, tfaEnabled }) => {
  if (loggedIn) {
    return <RedirectAfterLogin />;
  }

  if (!tfaEnabled) {
    return <Redirect to={AUTH_ROUTE} />;
  }

  return <React.Fragment>
    <CenteredLogo />
    <Panel sectioned accent title='Two-factor Authentication'>
      <TfaForm />
    </Panel>
  </React.Fragment>;
};

const mapStateToProps = ({ auth, tfa }) => ({
  loggedIn: auth.loggedIn,
  tfaEnabled: tfa.enabled
});

export default connect(mapStateToProps)(TfaPage);
