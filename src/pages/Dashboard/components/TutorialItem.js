import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import styles from './TutorialItem.module.scss';

const TutorialItem = ({
  label,
  helpText,
  labelLink,
  completed
}) => {
  const itemClasses = classnames(styles.Item, completed && styles.completed);

  const labelMarkup = labelLink
    ? <h6 className={classnames(styles.Label, styles.link)}><Link to={labelLink}>{ label }</Link></h6>
    : <h6 className={styles.Label}>{ label }</h6>;

  return (
    <div className={itemClasses}>
      { labelMarkup }
      <p className={styles.HelpText}>{ helpText }</p>
    </div>
  );
};

export default TutorialItem;
