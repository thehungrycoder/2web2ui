import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { showAlert } from 'src/actions/globalAlert';
import { getDraftAndPreview, sendPreview } from 'src/actions/templates';
import { selectDraftTemplate, selectDraftTemplatePreview } from 'src/selectors/templates';
import { selectSubaccountIdFromQuery } from 'src/selectors/subaccounts';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { hasGrants } from 'src/helpers/conditions';
import PreviewPage from '../PreviewPage';

export const mapStateToProps = (state, props) => {
  const subaccountId = selectSubaccountIdFromQuery(state, props);

  return {
    mode: 'draft',
    canSendEmail: hasGrants('transmissions/modify')(state),
    returnPath: `/templates/edit/${props.match.params.id}${setSubaccountQuery(subaccountId)}`,
    preview: selectDraftTemplatePreview(state, props.match.params.id),
    template: selectDraftTemplate(state, props.match.params.id),
    subaccountId
  };
};

const mapDispatchToProps = { onLoad: getDraftAndPreview, sendPreview, showAlert };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewPage));
