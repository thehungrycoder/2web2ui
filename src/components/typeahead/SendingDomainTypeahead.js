
import { connect } from 'react-redux';
import { list as listSendingDomains } from 'src/actions/sendingDomains';
import { selectDkimVerifiedDomains } from 'src/selectors/sendingDomains';
import { Typeahead } from './Typeahead';
import React, { Component } from 'react';

export class SendingDomainTypeahead extends Component {
  static defaultProps = {
    name: 'sendingDomain'
  };

  componentDidMount() {
    this.props.listSendingDomains();
  }

  render() {
    const { hasVerifiedDomains } = this.props;

    if (!hasVerifiedDomains) {
      return null;
    }

    return (
      <Typeahead
        label="Sending Domain"
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const verifiedDomains = selectDkimVerifiedDomains(state);

  return {
    results: verifiedDomains,
    hasVerifiedDomains: verifiedDomains.length > 0
  };
};

export default connect(mapStateToProps, { listSendingDomains })(SendingDomainTypeahead);
