import React, { Component, Fragment } from 'react';
import styles from './RecipientVerificationPage.module.scss';

export class SingleResult extends Component {

  render() {
    const { email, valid, reason } = this.props;

    return (
      <Fragment>
        <br/>
        {(valid) ? <p className={styles.Paragraph}>{email} is a valid email address</p> : <p className={styles.Paragraph}>{email} is NOT a valid email address. {reason}</p>}
      </Fragment>
    );
  }
}

export default SingleResult;
