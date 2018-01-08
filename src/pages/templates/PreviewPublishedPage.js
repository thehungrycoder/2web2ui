import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { showAlert } from 'src/actions/globalAlert';
import { getPublishedAndPreview, sendPreview } from 'src/actions/templates';
import { selectPublishedTemplate, selectPublishedTemplatePreview } from 'src/selectors/templates';
import PreviewPage from './components/PreviewPage';

export class PreviewPublishedPage extends Component {
  state = {
    loading: true
  }

  componentDidMount() {
    this.props.getPublishedAndPreview(this.props.match.params.id)
      .then(() => { this.setState({ loading: false }); });
  }

  render() {
    return (
      <PreviewPage
        editTemplatePath={`/templates/edit/${this.props.match.params.id}/published`}
        loading={this.state.loading}
        mode="published"
        {...this.props}
      />
    );
  }
}

export const mapStateToProps = (state, props) => ({
  preview: selectPublishedTemplatePreview(state, props.match.params.id),
  template: selectPublishedTemplate(state, props.match.params.id)
});

const mapDispatchToProps = { getPublishedAndPreview, sendPreview, showAlert };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewPublishedPage));
