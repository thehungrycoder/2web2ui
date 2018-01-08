import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { showAlert } from 'src/actions/globalAlert';
import { getDraftAndPreview, sendPreview } from 'src/actions/templates';
import { selectDraftTemplate, selectDraftTemplatePreview } from 'src/selectors/templates';
import PreviewPage from './components/PreviewPage';

export class PreviewDraftPage extends Component {
  state = {
    loading: true
  }

  componentDidMount() {
    this.props.getDraftAndPreview(this.props.match.params.id)
      .then(() => { this.setState({ loading: false }); });
  }

  render() {
    return (
      <PreviewPage
        editTemplatePath={`/templates/edit/${this.props.match.params.id}`}
        loading={this.state.loading}
        mode="draft"
        {...this.props}
      />
    );
  }
}

export const mapStateToProps = (state, props) => ({
  preview: selectDraftTemplatePreview(state, props.match.params.id),
  template: selectDraftTemplate(state, props.match.params.id)
});

const mapDispatchToProps = { getDraftAndPreview, sendPreview, showAlert };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewDraftPage));
