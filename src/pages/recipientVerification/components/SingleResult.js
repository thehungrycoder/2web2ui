import React, { Component, Fragment } from 'react';
import { CheckCircleOutline, Warning } from '@sparkpost/matchbox-icons';
import styles from './RecipientVerificationPage.module.scss';

const validText = ' is a valid email address.';
const invalidText = ' is NOT a valid email address.';

export class SingleResult extends Component {

  renderValid(email) {
    return <p>
      <CheckCircleOutline className={styles.validIcon}/>
      <span className={styles.email}> {email}</span>
      <span className={styles.Paragraph}>{validText}</span>
    </p>;
  }

  renderInvalid(email, reason) {
    return <p>
      <Warning className={styles.invalidIcon}/>
      <span className={styles.email}> {email}</span>
      <span className={styles.Paragraph}>{invalidText} {reason}</span>
    </p>;
  }

  render() {
    const { valid, email, reason } = this.props.singleResults;

    return <Fragment>
      <br/>
      {(valid) ? this.renderValid(email) : this.renderInvalid(email, reason)}
    </Fragment>;
  }
}

export default SingleResult;
