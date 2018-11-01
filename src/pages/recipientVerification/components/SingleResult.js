import React, { Component, Fragment } from 'react';
import { CheckCircleOutline, Warning } from '@sparkpost/matchbox-icons';
import styles from './SingleAddressForm.module.scss';

const validText = ' is a valid email address.';
const invalidText = ' is NOT a valid email address.';

export class SingleResult extends Component {

  renderValid() {
    const { email } = this.props.singleResults;

    return <p>
      <CheckCircleOutline className={styles.validIcon}/>
      <span className={styles.email}> {email}</span>
      <span className={styles.Paragraph}>{validText}</span>
    </p>;
  }

  renderInvalid() {
    const { email, reason } = this.props.singleResults;

    return <p>
      <Warning className={styles.invalidIcon}/>
      <span className={styles.email}> {email}</span>
      <span className={styles.Paragraph}>{invalidText} {reason}.</span>
    </p>;
  }

  render() {
    const { valid } = this.props.singleResults;

    return <Fragment>
      <br/>
      {(valid) ? this.renderValid() : this.renderInvalid()}
    </Fragment>;
  }
}

export default SingleResult;
