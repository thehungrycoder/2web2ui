import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { Icon } from '@sparkpost/matchbox';
import styles from './TutorialItem.module.scss';

const TutorialItem = ({
  label,
  children,
  labelLink,
  completed
}) => {
  const itemClasses = classnames(styles.Item, completed && styles.completed);

  const labelMarkup = (labelLink && !completed)
    ? <h6 className={classnames(styles.Label, styles.link)}><Link to={labelLink}>{ label } <Icon name='ArrowRight'/></Link></h6>
    : <h6 className={styles.Label}>{ label }</h6>;

  const completedMarkup = completed
    ? <Icon name='Check' size={24} className={styles.Completed} />
    : null;

  return (
    <div className={itemClasses}>
      { completedMarkup }
      <div className={styles.Content}>
        { labelMarkup }
        {!completed && <div className={styles.HelpText}>{ children }</div>}
      </div>
    </div>
  );
};

export default TutorialItem;
