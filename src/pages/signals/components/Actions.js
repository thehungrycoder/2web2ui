import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from 'src/helpers/date';
import ExternalLink from 'src/components/externalLink/ExternalLink';
import { Warning } from '@sparkpost/matchbox-icons';
import styles from './Actions.module.scss';

const Action = ({ content, link }) => {
  const linkMarkup = link && (
    <ExternalLink to={link} className={styles.Link}>Learn More</ExternalLink>
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
