import { connect } from 'react-redux';
import { listTemplates } from 'src/actions/templates';
import { selectPublishedTemplatesBySubaccount } from 'src/selectors/templates';
import { Typeahead } from './Typeahead';
import React, { Component } from 'react';
import Item from './TemplateTypeaheadItem';

export class TemplateTypeahead extends Component {
  static defaultProps = {
    name: 'template'
  };

  componentDidMount() {
    this.props.listTemplates();
  }

  render() {
    const { hasTemplates } = this.props;

    return (
      <Typeahead
        renderItem={(item) => <Item id={item.id} />}
        itemToString={(item) => (item ? item.id : '')}
        label="Template"
        disabled={!hasTemplates}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state, props) {
  const templates = selectPublishedTemplatesBySubaccount(state, props);
  return {
    results: templates,
    hasTemplates: templates.length > 0
  };
}

export default connect(mapStateToProps, { listTemplates })(TemplateTypeahead);
