
import { connect } from 'react-redux';
import { list as getSubaccountsList } from 'src/actions/subaccounts';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { Typeahead } from './Typeahead';
import React, { Component } from 'react';
import Item from './SubaccountTypeaheadItem';

export class SubaccountTypeahead extends Component {
  static defaultProps = {
    name: 'subaccount'
  };

  render() {
    const { hasSubaccounts } = this.props;

    if (!hasSubaccounts) {
      return null;
    }

    return (
      <Typeahead
        renderItem={(item) => <Item name={item.name} id={item.id} /> }
        itemToString={(item) => (item ? `${item.name} (${item.id})` : '')}
        {...this.props}
      />
    );
  }

  componentDidMount() {
    const { hasSubaccounts } = this.props;
    if (hasSubaccounts) {
      this.props.getSubaccountsList();
    }
  }
}

const mapStateToProps = (state) => ({
  hasSubaccounts: hasSubaccounts(state),
  results: state.subaccounts.list
});

export default connect(mapStateToProps, { getSubaccountsList })(SubaccountTypeahead);
