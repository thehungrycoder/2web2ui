import React from 'react';
import { Button } from '@sparkpost/matchbox';
import { OpenInNew } from '@sparkpost/matchbox-icons';
import styles from '../Support.module.scss';

const HerokuMessage = () => (
  <div className={styles.SupportContainer}>
    <h6>Please submit a ticket through Heroku</h6>
    <Button flat color='orange' external to='https://help.heroku.com'>Go to help.heroku.com <OpenInNew /></Button>
  </div>
);

export default HerokuMessage;
