import { connect } from 'react-redux';
import { listTemplates } from 'src/actions/templates';
import { selectTemplates } from 'src/selectors/templates';
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

    if (!hasTemplates) {
      return null;
    }

    return (
      <Typeahead
        renderItem={(item) => <Item id={item.id} />}
        itemToString={(item) => (item ? item.id : '')}
        label="Template"
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const templates = selectTemplates(state);

  return {
    results: templates,
    hasTemplates: templates.length > 0
  };
}

export default connect(mapStateToProps, { listTemplates })(TemplateTypeahead);
