import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SparkPost } from 'src/components';
import { WindowSizeContext } from 'src/context/WindowSize';
import { UnstyledLink } from '@sparkpost/matchbox';
import { HelpOutline, Menu, Close } from '@sparkpost/matchbox-icons';
import { openSupportPanel } from 'src/actions/support';
import AccountDropdown from './AccountDropdown';
import NotificationCenter from 'src/components/notifications/NotificationCenter';
import styles from './Top.module.scss';

export class Top extends Component {
  renderMobile = () => (
    <div className={styles.Top}>
      <UnstyledLink onClick={this.props.toggleMobileNav} className={styles.Menu}>
        {this.props.open ? <Close size={24}/> : <Menu size={24}/>}
      </UnstyledLink>
      <div className={styles.MobileLogo}><SparkPost.Logo type='halfWhite' /></div>
      <div className={styles.MobileAccountDropdownWrapper}>
        <AccountDropdown />
      </div>
    </div>
  );

  renderDesktop = () => (
    <div className={styles.Top}>
      <div className={styles.Logo}><SparkPost.Logo type='halfWhite' /></div>
      <div className={styles.RightSideWrapper}>
        <NotificationCenter />
        <HelpOutline className={styles.SupportIcon} onClick={this.openSupportPanel} size={22} />
        <AccountDropdown />
      </div>
    </div>
  );

  openSupportPanel = () => { this.props.openSupportPanel(); }

  render() {
    return (
      <WindowSizeContext.Consumer children={({ mobile }) => mobile ? this.renderMobile() : this.renderDesktop()} />
    );
  }
}

export default connect(undefined, { openSupportPanel })(Top);
