import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import findRouteByPath from 'src/helpers/findRouteByPath';
import * as analytics from 'src/helpers/analytics';

// This component is responsible for loading the GTM snippet, initialising our analytics
// module, setting the username analytics variable and firing the content-view even on route change.

export class GoogleTagManager extends Component {
  state = {
    dataLayerLoaded: false
  }

  componentDidMount() {
    analytics.setup();

    const route = findRouteByPath(this.props.location.pathname);
    // for public routes, track initial page view immediately
    if (route.public) {
      this.trackPageview();
    }

    // for non-public routes, store flag to let us know we need to track initial page view once the username loads
    this.setState({ dataLayerLoaded: true });
  }

  componentDidUpdate(prevProps) {
    const isNewRoute = prevProps.location.pathname !== this.props.location.pathname;
    const userHasLoaded = !prevProps.username && this.props.username;

    if (userHasLoaded) {
      analytics.setVariable('accountid', this.props.accountId);
      analytics.setVariable('username', this.props.username);
    }

    // Track additional page views whenever the route changes or when username first loads on auth page initial load
    if (isNewRoute) {
      this.trackPageview();
    }
  }

  trackPageview() {
    const { location } = this.props;
    const route = findRouteByPath(location.pathname);

    analytics.trackPageview({
      path: location.pathname + location.search, // duplicates angular 1.x ui-router "$location.url()" which is /path?plus=search
      title: route.title || location.pathname // duplicate angular 1.x $rootScope.stateData.title
    });
  }

  render() {
    const src = `https://www.googletagmanager.com/gtm.js?id=${this.props.id}`;
    return (
      <Helmet>
        {this.state.dataLayerLoaded && <script src={src} type="text/javascript" async={true} />}
      </Helmet>
    );
  }
}

const mapStateToProps = ({ currentUser }) => ({
  accountId: currentUser.customer,
  username: currentUser.username
});
const Connected = connect(mapStateToProps)(GoogleTagManager);
export default withRouter(Connected);
