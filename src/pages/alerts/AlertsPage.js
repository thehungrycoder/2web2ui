import { Component } from 'react';
import { EmptyState } from '@sparkpost/matchbox';
import styles from './AlertsPage.module.scss';
import ExternalLink from '../../components/externalLink/ExternalLink';
import { Generic } from '../../components/images';
import { LINKS } from 'src/constants';
import React from 'react';


export class AlertsPage extends Component {
  render() {
    return (
      <EmptyState
        title="Alerts"
        image={Generic}
        primaryAction={{ content: 'Create an Alert', to: LINKS.ALERTS_DOCS, component: ExternalLink }}
        secondaryAction={{ content: 'Tell us what else you’d like to see in Alerts', to: LINKS.ALERTS_SURVEY, component: ExternalLink }}
      >
        <p className={styles.Paragraph}>Are you looking for notifications when you get close to your monthly plan volume so that you can avoid overages?  Looking for notifications on other metrics?</p>
      </EmptyState>
    );
  }
}

export default AlertsPage;
