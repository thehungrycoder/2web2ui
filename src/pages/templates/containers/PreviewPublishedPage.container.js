import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { showAlert } from 'src/actions/globalAlert';
import { getPublishedAndPreview, sendPreview } from 'src/actions/templates';
import { selectPublishedTemplate, selectPublishedTemplatePreview, selectSubaccountIdFromQuery } from 'src/selectors/templates';
import { getSubaccountQuery } from 'src/helpers/templates';
import PreviewPage from '../PreviewPage';

export const mapStateToProps = (state, props) => {
  const subaccountId = selectSubaccountIdFromQuery(props);
  return {
    mode: 'published',
    returnPath: `/templates/edit/${props.match.params.id}/published${getSubaccountQuery(subaccountId)}`,
    preview: selectPublishedTemplatePreview(state, props.match.params.id),
    template: selectPublishedTemplate(state, props.match.params.id),
    subaccountId
  };
};

const mapDispatchToProps = { onLoad: getPublishedAndPreview, sendPreview, showAlert };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewPage));
