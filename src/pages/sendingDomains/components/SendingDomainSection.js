import React, { Component } from 'react';
import { Grid } from '@sparkpost/matchbox';
import styles from './SendingDomainSection.module.scss';

const Left = ({ children }) => (
  <Grid.Column xs={12} lg={5}>
    <div className={styles.Left}>{children}</div>
  </Grid.Column>
);
const Right = ({ children }) => (
  <Grid.Column xs={12} lg={7}>
    <div className={styles.Right}>{children}</div>
  </Grid.Column>
);

export class SendingDomainSection extends Component {
  static Left = Left;
  static Right = Right;

  render() {
    const { title, children } = this.props;

    return (
      <div className={styles.SendingDomainSection}>
        <hr className={styles.Hr}/>
        <h3>{title}</h3>
        <Grid>
          {children}
        </Grid>
      </div>
    );
  }
}
