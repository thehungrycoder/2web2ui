import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { UnstyledLink } from '@sparkpost/matchbox';
import { markAsCurrent } from 'src/actions/api-keys';

import { setSubaccountQuery } from 'src/helpers/subaccounts';

export class ApiKeyLabel extends Component {
  getDetailsRouter() {
    const { id, subaccount_id } = this.props.apiKey;
    return `/account/api-keys/details/${id}${setSubaccountQuery(subaccount_id)}`;
  }

  handleClick = () => {
    const { apiKey, history } = this.props;
    this.props.markAsCurrent(apiKey.id);

    history.push(this.getDetailsRouter());
  }

  render() {
    const { label } = this.props.apiKey;

    return <UnstyledLink onClick={this.handleClick}>{label}</UnstyledLink>;
  }

}


export default withRouter(connect(null, { markAsCurrent })(ApiKeyLabel));
