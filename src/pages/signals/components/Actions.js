import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from 'src/helpers/date';
import ExternalLink from 'src/components/externalLink/ExternalLink';
import { Warning, CheckCircleOutline } from '@sparkpost/matchbox-icons';
import Callout from 'src/components/callout';
import styles from './Actions.module.scss';

const Action = ({ content, link, type = 'bad' }) => {
  let iconMarkup;

  const linkMarkup = link && (
    <ExternalLink to={link} className={styles.Link}>Learn More</ExternalLink>
  );

  if (type === 'bad') {
    iconMarkup = <div className={styles.IconBad}><Warning size={25} /></div>;
  }

  if (type === 'good') {
    iconMarkup = <div className={styles.IconGood}><CheckCircleOutline size={25} /></div>;
  }

  if (type === 'warning') {
    iconMarkup = <div className={styles.IconWarning}><Warning size={25} /></div>;
  }

  return (
    <div className={styles.ActionWrapper}>
      <div className={styles.Action}>
        {iconMarkup}
        <p>{content}{' '}{linkMarkup}</p>
      </div>
      <hr className={styles.Dash}/>
    </div>
  );
};

const Actions = ({ actions, date, empty }) => (
  <div className={styles.Wrapper}>
    <div className={styles.Title}>
      <h6 className={styles.TitleText}>
          Items needing attention
        {date && ` – ${formatDate(date)}`}
      </h6>
    </div>
    {!empty && actions.map((props, i) => <Action key={i} {...props} />)}
    {empty && <Callout height='100px'>No actions to display at this time.</Callout>}
  </div>
);

Actions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['good', 'bad', 'warning']),
    content: PropTypes.node,
    link: PropTypes.string
  })),
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
};

export default Actions;
