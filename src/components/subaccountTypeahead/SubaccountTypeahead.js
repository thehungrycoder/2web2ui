
import { connect } from 'react-redux';
import { list as getSubaccountsList } from 'src/actions/subaccounts';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { Typeahead } from './Typeahead';

export class SubaccountTypeahead extends Typeahead {
  static defaultProps = {
    name: 'subaccount'
  };

  render() {
    const { hasSubaccounts } = this.props;

    if (!hasSubaccounts) {
      return null;
    }

    return super.render();
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
