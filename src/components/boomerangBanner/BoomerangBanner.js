import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';
import config from 'src/config';

const SNIPPET_URL = 'https://s3.amazonaws.com/assets.heroku.com/boomerang/boomerang.js';
const COOKIE_NAME = config.heroku.cookieName;
const OPTIONS = { path: '/', domain: config.website.domain };

export class BoomerangBanner extends Component {
  /**
   * Tries to load the cookie data from the heroku-nav-data cookie and then adds the heroku bar based on its contents.
   */
  barMe() {
    const cookieValue = Cookies.get(COOKIE_NAME);

    if (cookieValue) {
      try {
        const cookieData = JSON.parse(atob(cookieValue));

        window.Boomerang.init({
          app: cookieData.appname,
          addon: 'SparkPost',
          user: cookieData.user,
          org: cookieData.org
        });
      } catch (e) {
        //silently ignore
      }
    }

  }

  /**
   * Cleans up Heroku resources like cookies and the Boomerang bar
   */
  destroy() {
    Cookies.remove(COOKIE_NAME, OPTIONS);
    // this.$window.Boomerang.reset(); // just kidding! this doesn't work! see https://github.com/heroku/boomerang/pull/21
    document.getElementById('#heroku-boomerang').remove(); // so we'll do this instead until that PR gets merged
  }

  render() {
    return (
      <Helmet>
        <script src={SNIPPET_URL} type="text/javascript" />
        {this.barMe()}
      </Helmet>
    );
  }
}

export default withRouter(BoomerangBanner);
