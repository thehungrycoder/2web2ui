import React from 'react';
import { UnstyledLink, Snackbar } from '@sparkpost/matchbox';
import styles from '../CookieConsent.module.scss';

export const ConsentBar = ({ onDismiss }) => <div className={styles.CookieConsent}>
  <div className={styles.ConsentBar}>
    <Snackbar maxWidth={700} onDismiss={onDismiss}>
      We use cookies to optimize your experience, analyze traffic, and personalize content. To learn more, please visit our <UnstyledLink external to={'https://www.sparkpost.com/policies/privacy/'}>Cookie Policy</UnstyledLink>. By using our site without disabling cookies, you consent to our use of them.</Snackbar>
  </div>
</div>;

