import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import findRouteByPath from 'src/helpers/findRouteByPath';

export class GoogleTagManager extends Component {
  state = {
    dataLayerLoaded: false
  }

  componentDidMount() {
    window.dataLayer = [];
    this.trackPageview(); // track initial page view
    this.setState({ dataLayerLoaded: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.trackPageview();
    }

    // Google Tag Manager dataLayer set up
    if (!prevProps.username && this.props.username) {
      window.dataLayer.push({ username: this.props.username });
    }
  }

  trackPageview() {
    const { location } = this.props;
    const route = findRouteByPath(location.pathname);

    window.dataLayer.push({
      event: 'content-view',
      'content-name': location.pathname + location.search, // duplicates angular 1.x ui-router "$location.url()" which is /path?plus=search
      'content-title': route.title || location.pathname // duplicate angular 1.x $rootScope.stateData.title
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

const mapStateToProps = ({ currentUser }) => ({ username: currentUser.username });
const Connected = connect(mapStateToProps)(GoogleTagManager);
export default withRouter(Connected);
