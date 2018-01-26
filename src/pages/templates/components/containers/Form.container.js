import { connect } from 'react-redux';
import { change } from 'redux-form';
import { list as listDomains } from 'src/actions/sendingDomains';
import { selectDomainsBySubaccount } from 'src/selectors/templates';
import { hasSubaccounts } from 'src/selectors/subaccounts';

import Form from '../Form';

const mapStateToProps = (state, props) => ({
  domains: selectDomainsBySubaccount(state, props),
  hasSubaccounts: hasSubaccounts(state)
});

export default connect(mapStateToProps, { change, listDomains })(Form);
