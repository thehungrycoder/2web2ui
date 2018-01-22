import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { showAlert } from 'src/actions/globalAlert';
import { getDraftAndPreview, sendPreview } from 'src/actions/templates';
import { selectDraftTemplate, selectDraftTemplatePreview, selectSubaccountIdFromQuery } from 'src/selectors/templates';
import { getSubaccountQuery } from 'src/helpers/templates';
import PreviewPage from './components/PreviewPage';

export function PreviewDraftPage(props) {
  return (
    <PreviewPage
      mode="draft"
      returnPath={`/templates/edit/${props.match.params.id}${getSubaccountQuery(props.subaccountId)}`}
      {...props}
    />
  );
}

export const mapStateToProps = (state, props) => ({
  preview: selectDraftTemplatePreview(state, props.match.params.id),
  template: selectDraftTemplate(state, props.match.params.id),
  subaccountId: selectSubaccountIdFromQuery(props)
});

const mapDispatchToProps = { onLoad: getDraftAndPreview, sendPreview, showAlert };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewDraftPage));
