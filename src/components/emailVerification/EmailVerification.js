import React, { Component } from 'react';
import { connect } from 'react-redux';
import { verifyEmailToken } from 'src/actions/currentUser';
import { Loading } from 'src/components';
import { showAlert } from 'src/actions/globalAlert';

export class EmailVerification extends Component {
  componentDidMount() {
    const { token, verifyEmailToken } = this.props;
    verifyEmailToken({ token });
  }

  componentDidUpdate(prevProps) {
    const { history, showAlert, verifyingToken, error } = this.props;

    if (!prevProps.error && error) {
      showAlert({
        type: 'error',
        message: 'Email verification failed.  The verification token is either invalid or expired.',
        details: error.message
      });
      history.push('/dashboard');
    }

    if (!error && verifyingToken === false) {
      showAlert({
        type: 'success',
        message: 'Your email address has been verified!'
      });
      history.push('/dashboard');
    }


  }

  render() {
    const { verifyingToken } = this.props;

    if (verifyingToken) {
      return <Loading />;
    }

    return null;
  }
}

const mapStateToProps = (state, props) => ({
  token: props.match.params.token,
  verifyingToken: state.currentUser.verifyingToken,
  error: state.currentUser.tokenError
});

export default connect(mapStateToProps, { verifyEmailToken, showAlert })(EmailVerification);

