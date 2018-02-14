import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { showAlert } from 'src/actions/globalAlert';
import { createApiKey, hideNewApiKey } from 'src/actions/api-keys';
import { connect } from 'react-redux';
import { Loading } from 'src/components';

const keyDefaults = {
  label: 'Send Email Key (auto-generated)',
  grants: { 'smtp/inject': true, 'transmissions/modify': true, 'templates/view': true }
};


// Handles API key generation
// apiKey - new keys
// email - user's email
class AutoKeyGenerator extends Component {
  componentDidMount() {
    const { createApiKey, showAlert, history } = this.props;

    createApiKey(keyDefaults).catch((err) => {
      showAlert({ type: 'error', message: 'Sorry, something went wrong', details: err.message });
      history.push('/dashboard');
    });
  }

  componentWillUnmount() {
    this.props.hideNewApiKey();
  }

  render() {
    const { apiKey, children, email } = this.props;

    if (!apiKey) {
      return <Loading />;
    }

    return children({ apiKey, email });
  }
}

AutoKeyGenerator.defaultProps = {
  email: 'email address here'
};

AutoKeyGenerator.propTypes = {
  children: PropTypes.func.isRequired,
  apiKey: PropTypes.string,
  email: PropTypes.string
};

const mapStateToProps = ({ apiKeys, currentUser }) => ({
  apiKey: apiKeys.newKey,
  email: currentUser.email
});
export default withRouter(connect(mapStateToProps, { createApiKey, hideNewApiKey, showAlert })(AutoKeyGenerator));
