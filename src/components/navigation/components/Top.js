import React, { Component } from 'react';
import { SparkPost } from 'src/components';
import { WindowSizeContext } from 'src/context/WindowSize';
import { UnstyledLink } from '@sparkpost/matchbox';
import { Menu, Close } from '@sparkpost/matchbox-icons';
import AccountDropdown from './AccountDropdown';
import styles from './Top.module.scss';

class Top extends Component {
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
      <div className={styles.AccountDropdownWrapper}>
        <AccountDropdown />
      </div>
    </div>
  );

  render() {
    return (
      <WindowSizeContext.Consumer children={({ mobile }) => mobile ? this.renderMobile() : this.renderDesktop()} />
    );
  }
}

export default Top;
