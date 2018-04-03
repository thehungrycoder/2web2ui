
import { connect } from 'react-redux';
import { list as listSendingDomains } from 'src/actions/sendingDomains';
import { selectVerifiedDomains } from 'src/selectors/sendingDomains';
import { Typeahead } from './Typeahead';
import _ from 'lodash';

export class SendingDomainTypeahead extends Typeahead {
  static defaultProps = {
    name: 'sendingDomain'
  };

  componentDidMount() {
    this.props.listSendingDomains();
  }
}

const mapStateToProps = (state) => {
  const verifiedDomains = _.map(selectVerifiedDomains(state), (domain) => ({
    name: domain.domain,
    id: domain.domain
  }));

  return {
    results: verifiedDomains
  };
};

export default connect(mapStateToProps, { listSendingDomains })(SendingDomainTypeahead);
