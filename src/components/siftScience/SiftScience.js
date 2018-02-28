import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';
import uuidV4 from 'uuid/v4';

import { COOKIE_DOMAIN } from 'src/constants';

const COOKIE_EXPIRATION = 1; // days

// Shared with corporate website
// SEE: https://github.com/SparkPost/sparkpost.com/blob/fcc6758b78abf3dc4b1c6ee4f99799d999c75a7f/wordpress/wp-content/themes/jolteon/js/siftscience.js
const COOKIE_NAME = '_sp_session_id';
const SNIPPET_URL = 'https://cdn.siftscience.com/s.js';

// When you don't have or know the user's id, set the value to the empty string.
// SEE: https://support.siftscience.com/hc/en-us/articles/208370598
const UNDEFINED_CUSTOMER = '';

// SEE: https://siftscience.com/developers/docs/javascript/javascript-api
export class SiftScience extends Component {
  componentDidMount() {
    this.pushEvent('_setAccount', this.props.config.id);
    this.pushEvent('_setSessionId', this.findOrCreateSessionId());
    this.pushEvent('_setUserId', this.getPrefixedCustomer());
    this.pushEvent('_trackPageview');
  }

  componentDidUpdate(prevProps) {
    if (this.props.customer !== prevProps.customer) {
      this.pushEvent('_setUserId', this.getPrefixedCustomer());
    }

    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.pushEvent('_trackPageview');
    }
  }

  getPrefixedCustomer() {
    const prefix = this.props.config.accountPrefix || '';

    if (!this.props.customer) {
      return UNDEFINED_CUSTOMER;
    }

    return `${prefix}${this.props.customer}`;
  }

  findOrCreateSessionId() {
    const sessionId = Cookies.get(COOKIE_NAME);

    if (sessionId) {
      return sessionId;
    }

    const newSessionId = uuidV4();

    Cookies.set(COOKIE_NAME, newSessionId, {
      domain: COOKIE_DOMAIN,
      expires: COOKIE_EXPIRATION
    });

    return newSessionId;
  }

  pushEvent(...event) {
    if (!window._sift) {
      window._sift = [];
    }

    window._sift.push(event);
  }

  render() {
    return (
      <Helmet>
        <script src={SNIPPET_URL} type="text/javascript" />
      </Helmet>
    );
  }
}

const mapStateToProps = (state) => ({
  customer: state.currentUser.customer
});

export default withRouter(connect(mapStateToProps)(SiftScience));
