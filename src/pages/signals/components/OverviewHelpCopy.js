import React from 'react';
import ExternalLink from 'src/components/externalLink/ExternalLink';
import { Grid } from '@sparkpost/matchbox';
import styles from './OverviewHelpCopy.module.scss';

const OverviewHelpCopy = () => (
  <Grid>
    <Grid.Column xs={12} lg={5}>
      <p className={styles.Paragraph}>Compare your email health to the rest of the SparkPost network. Drill down into any issues you find to improve your email performance. Contact us if you have any questions! <ExternalLink to='https://www.sparkpost.com/docs/signals/overview/#health-score'>Learn More</ExternalLink></p>
    </Grid.Column>
  </Grid>
);

export default OverviewHelpCopy;
