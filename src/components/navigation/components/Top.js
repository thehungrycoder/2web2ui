import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { SparkPost } from 'src/components';
import { WindowSizeContext } from 'src/context/WindowSize';
import { UnstyledLink } from '@sparkpost/matchbox';
import { HelpOutline, Menu, Close } from '@sparkpost/matchbox-icons';
import { openSupportPanel } from 'src/actions/support';
import AccountDropdown from './AccountDropdown';
import NotificationCenter from 'src/components/notifications/NotificationCenter';
import styles from './Top.module.scss';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';
import { hasGrants } from 'src/helpers/conditions';
import { AccessControl } from 'src/components/auth';

export class Top extends Component {
  renderMobile = () => (
    <div className={styles.Top}>
      <UnstyledLink onClick={this.props.toggleMobileNav} className={styles.Menu}>
        {this.props.open ? <Close size={24}/> : <Menu size={24}/>}
      </UnstyledLink>
      <Link to={DEFAULT_REDIRECT_ROUTE} className={styles.MobileLogo}><SparkPost.Logo type='halfWhite' /></Link>
      <div className={styles.MobileAccountDropdownWrapper}>
        <AccountDropdown />
      </div>
    </div>
  );

  renderDesktop = () => (
    <div className={styles.Top}>
      <Link to={DEFAULT_REDIRECT_ROUTE} className={styles.Logo}><SparkPost.Logo type='halfWhite' /></Link>
      <div className={styles.RightSideWrapper}>
        <NotificationCenter />
        <AccessControl condition={hasGrants('support/manage')}>
          <HelpOutline className={styles.SupportIcon} onClick={this.openSupportPanel} size={22} />}
        </AccessControl>
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
