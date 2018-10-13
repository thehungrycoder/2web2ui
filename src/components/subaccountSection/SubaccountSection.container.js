import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import withFormName from 'src/components/withFormName';
import SubaccountSection from './SubaccountSection';

const mapStateToProps = (state, props) => {
  const selector = formValueSelector(props.formName);

  return {
    assignTo: selector(state, 'assignTo'),
    subaccountId: selector(state, 'subaccountId')
  };
};

export default withFormName(connect(mapStateToProps, { change })(SubaccountSection));
