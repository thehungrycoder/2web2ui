import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { loadHerokuToolbar } from 'src/helpers/heroku';

export class BoomerangBanner extends Component {
  constructor(props) {
    super(props);
    loadHerokuToolbar();
  }

  render() {
    return (
      <Helmet>
        <style type="text/css">
          {`
          body.heroku-boomerang-loaded {
            padding-top: 32px
          }
         `}
        </style>
      </Helmet>
    );
  }
}

export default BoomerangBanner;
