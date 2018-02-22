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
    const { history, showAlert, verifyingEmail, error } = this.props;

    if (!prevProps.error && error) {
      showAlert({
        type: 'error',
        message: 'The verification token is either invalid or expired.',
        details: error.message
      });
      history.push('/dashboard');
    }

    if (!error && verifyingEmail === false) {
      showAlert({
        type: 'success',
        message: 'Your email address has been verified!'
      });
      history.push('/dashboard');
    }


  }

  render() {
    const { verifyingEmail } = this.props;

    if (verifyingEmail) {
      return <Loading />;
    }

    return null;
  }
}

const mapStateToProps = (state, props) => ({
  token: props.match.params.token,
  verifyingEmail: state.currentUser.verifying,
  error: state.currentUser.verifyError
});

export default connect(mapStateToProps, { verifyEmailToken, showAlert })(EmailVerification);

