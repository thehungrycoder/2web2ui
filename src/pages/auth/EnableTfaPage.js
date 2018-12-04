import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Panel } from '@sparkpost/matchbox';
import EnableTfaForm from 'src/components/enableTfaForm/EnableTfaForm';
import RedirectAfterLogin from './components/RedirectAfterLogin';
import { login } from 'src/actions/auth';

export class EnableTfaPage extends React.Component {
  state = {};

  afterEnable = () => {
    const { token, username, refreshToken } = this.props.tfa;
    this.props.login({
      authData: {
        access_token: token,
        username,
        refresh_token: refreshToken
      },
      saveCookie: true
    });
  };

  render() {
    const { loggedIn } = this.props;

    if (loggedIn) {
      return <RedirectAfterLogin />;
    }

    return (
      <React.Fragment>
        <Panel sectioned accent title="Enable Two Factor Authentication">
          <Panel.Section>
            Your administrator requires all users on this account to use two factor authentication.
          </Panel.Section>
          <EnableTfaForm afterEnable={this.afterEnable} />
        </Panel>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth, tfa }) => ({
  loggedIn: auth.loggedIn,
  tfa
});

export default withRouter(
  connect(
    mapStateToProps,
    { login }
  )(EnableTfaPage)
);
