import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { showAlert } from 'src/actions/globalAlert';
import { getPublishedAndPreview, sendPreview } from 'src/actions/templates';
import { selectPublishedTemplate, selectPublishedTemplatePreview } from 'src/selectors/templates';
import { selectSubaccountIdFromQuery } from 'src/selectors/subaccounts';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { hasGrants } from 'src/helpers/conditions';
import PreviewPage from '../PreviewPage';

export const mapStateToProps = (state, props) => {
  const subaccountId = selectSubaccountIdFromQuery(state, props);

  return {
    mode: 'published',
    canSendEmail: hasGrants('transmissions/modify')(state),
    returnPath: `/templates/edit/${props.match.params.id}/published${setSubaccountQuery(subaccountId)}`,
    preview: selectPublishedTemplatePreview(state, props.match.params.id),
    template: selectPublishedTemplate(state, props.match.params.id),
    subaccountId
  };
};

const mapDispatchToProps = { onLoad: getPublishedAndPreview, sendPreview, showAlert };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewPage));
