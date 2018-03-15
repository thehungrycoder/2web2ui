import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from 'src/config';

const SNIPPET_URL = `https://www.googletagmanager.com/gtag/js?id=${config.gaTag}`;

export class RouteWatch extends Component {
  componentDidMount() {
    window.gtag('config', config.gaTag);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.trackPageview();
    }
  }

  trackPageview() {
    if (window.gtag) {
      window.gtag('config', config.gaTag, { page_path: this.props.location.pathname });
    }
  }

  render() {
    return (
      <Helmet>
        <script src={SNIPPET_URL} type="text/javascript" async={true} />
      </Helmet>
    );
  }
}

export default withRouter(RouteWatch);
