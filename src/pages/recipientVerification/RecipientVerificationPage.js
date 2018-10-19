import { Component } from 'react';
import { EmptyState } from '@sparkpost/matchbox';
import styles from './RecipientVerificationPage.module.scss';
import { Generic } from '../../components/images';
import React from 'react';


export class RecipientVerificationPage extends Component {
  render() {
    return (
      <EmptyState
        title="Recipient Email Verification"
        image={Generic}
      >
        <p className={styles.Paragraph}>Future awesome styles</p>
        >
      </EmptyState>
    );
  }
}

export default RecipientVerificationPage;
