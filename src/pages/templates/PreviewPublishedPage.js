import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { showAlert } from 'src/actions/globalAlert';
import { getPublishedAndPreview, sendPreview } from 'src/actions/templates';
import { selectPublishedTemplate, selectPublishedTemplatePreview, selectSubaccountId } from 'src/selectors/templates';
import PreviewPage from './components/PreviewPage';

export function PreviewPublishedPage(props) {
  return (
    <PreviewPage
      mode="published"
      returnPath={`/templates/edit/${props.match.params.id}/published`}
      {...props}
    />
  );
}

export const mapStateToProps = (state, props) => ({
  preview: selectPublishedTemplatePreview(state, props.match.params.id),
  template: selectPublishedTemplate(state, props.match.params.id),
  subaccountId: selectSubaccountId(props)
});

const mapDispatchToProps = { onLoad: getPublishedAndPreview, sendPreview, showAlert };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewPublishedPage));
