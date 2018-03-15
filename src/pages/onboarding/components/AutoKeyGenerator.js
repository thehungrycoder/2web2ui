import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { createApiKey, hideNewApiKey } from 'src/actions/api-keys';
import { connect } from 'react-redux';
import { Loading } from 'src/components';

const keyDefaults = {
  label: 'Send Email Key (auto-generated)',
  grants: ['smtp/inject', 'transmissions/modify', 'templates/view']
};

// Handles API key generation
// Passes down newly created apiKey and current user's email address
export class AutoKeyGenerator extends Component {
  componentDidMount() {
    this.createKey();
  }

  componentWillUnmount() {
    this.props.hideNewApiKey();
  }

  createKey = () => {
    const { createApiKey, history } = this.props;
    return createApiKey(keyDefaults).catch((err) => { history.push('/dashboard'); });
  }

  render() {
    const { apiKey, render, email } = this.props;

    if (!apiKey) {
      return <Loading />;
    }

    return render({ apiKey, email });
  }
}

AutoKeyGenerator.defaultProps = {
  email: 'email address here'
};

AutoKeyGenerator.propTypes = {
  render: PropTypes.func.isRequired,
  apiKey: PropTypes.string,
  email: PropTypes.string
};

const mapStateToProps = ({ apiKeys, currentUser }) => ({
  apiKey: apiKeys.newKey,
  email: currentUser.email
});
export default withRouter(connect(mapStateToProps, { createApiKey, hideNewApiKey })(AutoKeyGenerator));
