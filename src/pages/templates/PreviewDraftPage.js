import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as TemplateActions from 'src/actions/templates';
import PreviewPage from './components/PreviewPage';

export class PreviewDraftPage extends Component {
  componentDidMount() {
    if (!this.props.template) {
      this.props.getDraft(this.props.match.params.id);
    }
  }

  render() {
    return (
      <PreviewPage
        editTemplatePath={`/templates/edit/${this.props.match.params.id}`}
        label="Draft"
        template={this.props.template}
      />
    );
  }
}

export const mapStateToProps = (state, props) => {
  const templates = state.templates.byId[props.match.params.id] || {};

  return {
    template: templates.draft
  };
};

const mapDispatchToProps = { ...TemplateActions };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewDraftPage));
