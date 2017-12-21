import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import config from 'src/config';

export class RouteWatch extends Component {
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
    return null;
  }
}

export default withRouter(RouteWatch);
