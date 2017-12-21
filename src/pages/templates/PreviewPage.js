import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';

import * as TemplateActions from 'src/actions/templates';
import { Loading } from 'src/components';

import PreviewPanel from './components/PreviewPanel';

const IS_PUBLISHED_REGEX = new RegExp('/templates/preview/.+/published');

export class PreviewPage extends Component {
  componentDidMount() {
    if (!this.props.template) {
      this.getTemplate();
    }
  }

  getTemplate() {
    const { id } = this.props.match.params;

    this.props.isPublished
      ? this.props.getPublished(id)
      : this.props.getDraft(id);
  }

  render() {
    if (!this.props.template) {
      return <Loading />;
    }

    const pageProps = {
      breadcrumbAction: {
        Component: Link,
        content: 'Edit Template',
        to: this.props.editTemplatePath
      },
      title: `${this.props.template.name} (${this.props.isPublished ? 'Published' : 'Draft'})`
    };

    return (
      <Page {...pageProps}>
        <PreviewPanel {...this.props.template.content}/>
      </Page>
    );
  }
}

export const mapStateToProps = (state, props) => {
  const isPublished = IS_PUBLISHED_REGEX.test(props.match.path);
  const template = state.templates.byId[props.match.params.id] || {};
  const type = isPublished ? 'published' : 'draft';

  return {
    editTemplatePath: isPublished
      ? `/templates/edit/${props.match.params.id}/published`
      : `/templates/edit/${props.match.params.id}`,
    isPublished,
    template: template[type]
  };
};

const mapDispatchToProps = { ...TemplateActions };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewPage));
