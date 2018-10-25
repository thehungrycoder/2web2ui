import { connect } from 'react-redux';
import { listTemplates } from 'src/actions/templates';
import { showAlert } from 'src/actions/globalAlert';
import { sendTransmission } from 'src/actions/transmissions';
import { selectTemplates } from 'src/selectors/templates';
import CreatePageV3 from './CreatePageV3';

const mapStateToProps = (state) => ({
  sending: state.transmissions.sending,
  sentTo: state.transmissions.log,
  templates: selectTemplates(state)
});

const mapDispatchToProps = {
  listTemplates,
  sendTransmission,
  showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePageV3);
