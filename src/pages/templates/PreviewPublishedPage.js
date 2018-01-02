import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as TemplateActions from 'src/actions/templates';
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
        label="Published"
        loading={this.state.loading}
        preview={this.props.preview}
        template={this.props.template}
      />
    );
  }
}

export const mapStateToProps = (state, props) => {
  const templates = state.templates.byId[props.match.params.id] || {};

  return {
    preview: state.templates.contentPreview.published[props.match.params.id],
    template: templates.published
  };
};

const mapDispatchToProps = { ...TemplateActions };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewPublishedPage));
