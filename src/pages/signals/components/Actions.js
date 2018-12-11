import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from 'src/helpers/date';
import { UnstyledLink } from '@sparkpost/matchbox';
import { Warning, ChevronRight } from '@sparkpost/matchbox-icons';
import styles from './Actions.module.scss';

const Action = ({ content, link }) => {
  const linkMarkup = link && (
    <UnstyledLink to={link} external>
      Learn More<ChevronRight className={styles.LinkIcon} size={16}/>
    </UnstyledLink>
  );

  return (
    <div>
      <div className={styles.Action}>
        <div className={styles.Icon}><Warning size={25} /></div>
        <p>{content}{' '}{linkMarkup}</p>
      </div>
      <hr className={styles.Dash}/>
    </div>
  );
};

const Actions = ({ actions, date }) => {
  if (!actions || !actions.length) {
    return null;
  }

  return (
    <div>
      <div className={styles.Title}>
        <h6>
          Items needing attention
          {date && ` – ${formatDate(date)}`}
        </h6>
      </div>
      {actions.map((props, i) => <Action key={i} {...props} />)}
    </div>
  );
};

Actions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.node,
    link: PropTypes.string
  })),
  date: PropTypes.instanceOf(Date)
};

export default Actions;
