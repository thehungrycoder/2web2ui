import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { barMe } from 'src/helpers/heroku';

const SNIPPET_URL = 'https://s3.amazonaws.com/assets.heroku.com/boomerang/boomerang.js';

export class BoomerangBanner extends Component {
  /**
   * Attempt to load the boomerang banner and apply styling if it was loaded successfully
   */
  renderBanner() {
    const style = <div className={'heroku-boomerang-loaded'} style={{ marginTop: '32px' }}/>;

    // the bar is already in place, just return the style
    if (document.getElementById('heroku-boomerang')) {
      return style;
    }
    const tryBar = barMe();

    return (
      tryBar
        ? style
        : null
    );
  }

  render() {
    return (
      <div>
        <Helmet>
          <script src={SNIPPET_URL} type="text/javascript"/>
        </Helmet>
        {this.renderBanner()}
      </div>
    );
  }
}

export default withRouter(BoomerangBanner);
