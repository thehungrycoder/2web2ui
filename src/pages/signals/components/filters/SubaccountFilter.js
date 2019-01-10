import React from 'react';
import { connect } from 'react-redux';
import { Button, Popover, UnstyledLink } from '@sparkpost/matchbox';
import { ArrowDropDown, ChevronLeft } from '@sparkpost/matchbox-icons';
import SubaccountTypeahead from 'src/components/typeahead/SubaccountTypeahead';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import withSignalOptions from '../../containers/withSignalOptions';
import SubaccountOption from './SubaccountOption';
import styles from './SubaccountFilter.module.scss';

const OPTIONS = [
  {
    id: undefined,
    name: 'Master & All Subaccounts',
    condition: ({ id }) => !id && id !== 0
  },
  {
    id: 0,
    name: 'Master Account',
    condition: ({ id }) => id === 0
  },
  {
    name: 'Search for Subaccount',
    nested: true,
    condition: ({ id }) => id > 0
  }
];

export class SubaccountFilter extends React.Component {
  state = {
    isOpen: false,
    isSearchOpen: false
  }

  handleChange = ({ id, name }) => {
    this.setState({ isOpen: false, isSearchOpen: false });
    this.props.changeSignalOptions({ subaccount: { id, name }});
  }

  handleSearchToggle = () => {
    this.setState({ isSearchOpen: !this.state.isSearchOpen });
  }

  handleVisibilityToggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { hasSubaccounts, signalOptions: { subaccount = OPTIONS[0] }} = this.props;
    const { isOpen, isSearchOpen } = this.state;

    if (!hasSubaccounts) {
      return null;
    }

    return (
      <div className={styles.SubaccountFilter}>
        <Button onClick={this.handleVisibilityToggle}>
          <span className={styles.ButtonLabel}>
            {subaccount.name}
          </span>
          {subaccount.id > 0 && <span>({subaccount.id})</span>}
          <ArrowDropDown className={styles.ButtonIcon} />
        </Button>
        <Popover className={styles.Popover} left open={isOpen}>
          {isSearchOpen ? (
            <React.Fragment>
              <div className={styles.SubaccountSearchHeader}>
                <UnstyledLink className={styles.BackButton} onClick={this.handleSearchToggle}>
                  <ChevronLeft size={20} />
                </UnstyledLink>
                <span>Subaccount</span>
              </div>
              <div className={styles.SubaccountSearch}>
                <SubaccountTypeahead
                  label=""
                  onChange={this.handleChange}
                  placeholder="Search here"
                />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {OPTIONS.map(({ condition, id, name, nested }) => (
                <SubaccountOption
                  key={name}
                  label={name}
                  nested={nested}
                  onChange={this.handleChange}
                  onOpen={this.handleSearchToggle}
                  selected={condition(subaccount)}
                  value={{ id, name }}
                />
              ))}
            </React.Fragment>
          )}
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  hasSubaccounts: hasSubaccounts(state)
});

export default withSignalOptions(connect(mapStateToProps)(SubaccountFilter));
