import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Error } from '@sparkpost/matchbox';

import { CenteredLogo } from 'src/components';
import LoginForm from './LoginForm';
import TfaForm from './TfaForm';
import LoginRedirect from './LoginRedirect';

export class LoginPanel extends Component {
  render () {
    const { tfaEnabled, handleSubmit, ssoEnabled, title, loginError } = this.props;

    return (
      <div>
        <LoginRedirect />
        <CenteredLogo />
        <Panel sectioned accent title={title}>
          {loginError && <Error error={loginError} />}
          {tfaEnabled && <TfaForm />}
          {!tfaEnabled && <LoginForm onSubmit={handleSubmit} ssoEnabled={ssoEnabled}/>}
        </Panel>
        {!tfaEnabled && this.props.children}
      </div>
    );
  }

}

const mapStateToProps = ({ tfa }) => ({
  tfaEnabled: tfa.enabled
});

export default connect(mapStateToProps)(LoginPanel);
