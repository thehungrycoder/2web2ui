import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';

import SubaccountSection from '../SubaccountSection';

const mapStateToProps = (state, props) => {
  const selector = formValueSelector(props.formName);
  return {
    assignTo: selector(state, 'assignTo'),
    subaccountId: selector(state, 'subaccount_id')
  };
};

export default connect(mapStateToProps, { change })(SubaccountSection);
