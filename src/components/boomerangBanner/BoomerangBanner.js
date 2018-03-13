import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { barMe } from 'src/helpers/heroku';

export class BoomerangBanner extends Component {
  constructor(props) {
    super(props);
    barMe();
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

export default withRouter(BoomerangBanner);
