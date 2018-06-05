import React from 'react';
import { connect } from 'react-redux';
import { UnstyledLink } from '@sparkpost/matchbox';
import { entitledToPhoneSupport } from 'src/selectors/support';
import styles from '../Support.module.scss';

export const SupportContact = ({ entitledToPhoneSupport }) => {
  if (!entitledToPhoneSupport) {
    return null;
  }

  return (
    <div className={styles.SupportContainer}>
      <h6>We are available Monday through Friday, 9am to 8pm.</h6>
      <UnstyledLink to='tel:1-415-751-0928'>+1 (415) 751-0928</UnstyledLink>
    </div>
  );
};

const mapStateToProps = (state) => ({
  entitledToPhoneSupport: entitledToPhoneSupport(state)
});

export default connect(mapStateToProps, {})(SupportContact);
