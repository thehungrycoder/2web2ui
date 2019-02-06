import React, { Fragment } from 'react';
import { CheckCircleOutline, Warning } from '@sparkpost/matchbox-icons';
import styles from './SingleAddressForm.module.scss';

const validText = ' is a valid recipient.';
const invalidText = ' is NOT a valid recipient.';

const SingleResult = ({ singleResults = {}}) => {
  const { valid, reason, email, is_role, is_disposable } = singleResults;
  const text = valid ? validText : `${invalidText} ${reason}.`;

  const icon = valid
    ? <CheckCircleOutline className={styles.validIcon} size={27} />
    : <Warning className={styles.invalidIcon} size={27} />;

  return (
    <Fragment>
      <p className={styles.Validity}>
        <span className={styles.IconWrapper}>
          {icon}
        </span>
        <strong className={styles.email}> {email}</strong>
        <span>{text}</span>
      </p>
      <p className={styles.Paragraph}>
        This is {!is_role && 'not '}a <strong>role-based</strong> email address.
      </p>
      <p className={styles.Paragraph}>
          This is {!is_disposable && 'not '}a <strong>disposable</strong> email address.
      </p>
    </Fragment>
  );
};

export default SingleResult;
