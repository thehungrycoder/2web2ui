import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { entitledToPhoneSupport } from 'src/selectors/support';
import { Button } from '@sparkpost/matchbox';
import styles from './SupportCta.module.scss';

export const SupportCta = ({ entitledToPhoneSupport, toggleForm }) => {
  let leftContent = <span>Do you need more assistance?</span>;

  if (entitledToPhoneSupport) {
    leftContent = (
      <div className={styles.Phone}>
        <p>Phone Support: <strong>415-751-0928</strong></p>
        <p>Available: <strong>9am - 7pm EST, Mon-Fri</strong></p>
      </div>
    );
  }

  return (
    <Fragment>
      {leftContent}
      <Button primary onClick={toggleForm} className={styles.ToggleButton}>
        Submit a Ticket
      </Button>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  entitledToPhoneSupport: entitledToPhoneSupport(state)
});

export default connect(mapStateToProps, {})(SupportCta);
