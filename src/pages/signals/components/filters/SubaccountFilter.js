import React from 'react';
import { connect } from 'react-redux';
import { Button, Popover, UnstyledLink, WindowEvent } from '@sparkpost/matchbox';
import { ArrowDropDown, ChevronLeft } from '@sparkpost/matchbox-icons';
import SubaccountTypeahead from 'src/components/typeahead/SubaccountTypeahead';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import withSignalOptions from '../../containers/withSignalOptions';
import SubaccountOption from './SubaccountOption';
import { onEscape } from 'src/helpers/keyEvents';
import classnames from 'classnames';
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

  close = () => {
    this.setState({ isOpen: false, isSearchOpen: false });
  }

  handleChange = ({ id, name }) => {
    this.close();
    this.props.changeSignalOptions({ subaccount: { id, name }});
  }

  handleSearchToggle = () => {
    this.setState({ isSearchOpen: !this.state.isSearchOpen });
  }

  handleVisibilityToggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  containsTarget = (ref, e) => Boolean(ref && ref.contains(e.target))

  handleWindowClick = (e) => {
    if (!this.containsTarget(this.contentRef, e) && !this.containsTarget(this.triggerRef, e)) {
      this.close();
    }
  }

  render() {
    const { hasSubaccounts, signalOptions: { subaccount = OPTIONS[0] }} = this.props;
    const { isOpen, isSearchOpen } = this.state;

    if (!hasSubaccounts) {
      return null;
    }

    const trigger = (
      <span ref={(node) => this.triggerRef = node}>
        <Button onClick={this.handleVisibilityToggle}>
          <span className={styles.ButtonLabel}>
            {subaccount.name}
          </span>
          {subaccount.id > 0 && <span>({subaccount.id})</span>}
          <ArrowDropDown className={styles.ButtonIcon} />
        </Button>
      </span>
    );

    return (
      <div className={styles.SubaccountFilter}>
        <WindowEvent handler={this.handleWindowClick} event='click' />
        <WindowEvent handler={onEscape(this.close)} event='keydown' />
        <Popover className={styles.Popover} left open={isOpen} trigger={trigger}>
          <div ref={(node) => this.contentRef = node}>
            <div className={classnames(styles.PopoverContent, isSearchOpen && styles.showSearch)}>
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
            </div>
            <div className={classnames(styles.PopoverContent, !isSearchOpen && styles.showOptions)}>
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
            </div>

          </div>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  hasSubaccounts: hasSubaccounts(state)
});

export default withSignalOptions(connect(mapStateToProps)(SubaccountFilter));
