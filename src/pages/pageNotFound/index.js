import React, { Component } from 'react';
import { connect } from 'react-redux';

import { EmptyState } from '@sparkpost/matchbox';

export class PageNotFound extends Component {
  render() {
    return (<EmptyState
      title='Page Not Found'
      image='Generic'>
         <p>We cannot find what you're looking for, use the navigation to find your way.</p>
     </EmptyState>);
  }
}

export default connect(() => ({}), { })(PageNotFound);
