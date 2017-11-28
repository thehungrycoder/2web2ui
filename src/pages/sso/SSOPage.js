import { Component } from 'react';
import qs from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { login } from 'src/actions/auth';

const authPath = '/auth';

export class SSOPage extends Component {

  componentWillMount() {
    const params = qs.parse(this.props.location.search);

    const token = params.ad || params.token; // 'token' for azure, 'ad' for saml/heroku

    try {
      const data = JSON.parse(atob(token));

      if (data.accessToken && data.username) {
        this.props.login({
          access_token: data.accessToken,
          username: data.username,
          refresh_token: ''
        }, true);
        return this.props.history.push('/dashboard');

        //Heroku.barMe(); TODO: copied from old ui, fix it when heroku specific behaviors are implemented

      } else {
        return this.props.history.push(authPath);
      }
    } catch (e) {
      // something went wrong while parsing
      return this.props.history.push(authPath);
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = () => ({});


export default withRouter(connect(mapStateToProps, { login })(SSOPage));
