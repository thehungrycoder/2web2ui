import React from 'react';
import classnames from 'classnames';
import { Panel } from '@sparkpost/matchbox';
import { Check } from '@sparkpost/matchbox-icons';
import styles from './TutorialItem.module.scss';

const TutorialItem = ({
  label,
  children,
  labelLink,
  completed,
  actions
}) => {
  const itemClasses = classnames(styles.Item, completed && styles.completed);
  const labelMarkup = <h6 className={styles.Label}>{label}</h6>;

  const completedMarkup = completed
    ? (
      <div className={styles.CompletedBackDrop}>
        <Check size={21} className={styles.Completed} />
      </div>
    )
    : <div className={styles.NotCompleted} />;

  return (
    <Panel.Section actions={actions}>
      <div className={itemClasses}>
        <div className={styles.Icon}>
          {completedMarkup}
        </div>
        <div className={styles.Content}>
          {labelMarkup}
          <div className={styles.HelpText}>{children}</div>
        </div>
      </div>
    </Panel.Section>
  );
};

export default TutorialItem;
