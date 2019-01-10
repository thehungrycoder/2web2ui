import React, { Fragment } from 'react';
import { Tooltip } from '@sparkpost/matchbox';
import { InfoOutline } from '@sparkpost/matchbox-icons';
import styles from './ChartHeader.module.scss';

const ChartHeader = ({ title, primaryArea, hideLine, tooltipContent, padding = '' }) => (
  <Fragment>
    <div className={styles.ChartHeader} style={{ padding }}>
      <h6 className={styles.Title}>{title}</h6>
      {tooltipContent && (
        <div className={styles.Tooltip}>
          <Tooltip dark horizontalOffset='-1rem' content={tooltipContent}>
            <InfoOutline className={styles.TooltipIcon} size={17} />
          </Tooltip>
        </div>
      )}
      {primaryArea && <div className={styles.PrimaryArea}>{primaryArea}</div>}
    </div>
    {!hideLine && <hr className={styles.Line} />}
  </Fragment>
);

export default ChartHeader;
