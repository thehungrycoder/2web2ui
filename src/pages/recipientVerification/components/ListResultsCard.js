import React, { Fragment } from 'react';
import classnames from 'classnames';
import { Panel, Button } from '@sparkpost/matchbox';
import { InsertDriveFile, CheckCircleOutline } from '@sparkpost/matchbox-icons';
import DownloadLink from 'src/components/downloadLink/DownloadLink';
import LabelledValue from 'src/components/labelledValue/LabelledValue';
import { LoadingSVG } from 'src/components/loading/Loading';
import { formatDateTime } from 'src/helpers/date';
import TimeAgo from 'react-timeago';
import moment from 'moment';
import styles from './ListResultsCard.module.scss';

const ListResultsCard = ({ complete = 'unknown', uploaded, rejectedUrl }) => {
  if (complete === 'unknown') {
    return (
      <Panel>
        <div className={styles.LoadingWrapper}><LoadingSVG small /></div>
      </Panel>
    );
  }

  const uploadDate = moment.unix(uploaded);
  const expiration = moment(uploadDate).add(1, 'week');

  const Icon = complete
    ? CheckCircleOutline
    : InsertDriveFile;

  const proccessing = !complete
    ? <div className={styles.ProcessingWrapper}><LoadingSVG small /></div>
    : <div className={styles.Spacer}/>;

  const download = complete && (
    <Fragment>
      <small>This download will expire <TimeAgo date={expiration} /></small>
      <DownloadLink component={Button} to={rejectedUrl} fullWidth color='orange'>Download Rejected Recipients</DownloadLink>
    </Fragment>
  );

  return (
    <Panel sectioned>
      <div className={classnames(styles.IconWrapper, complete && styles.Complete)}>
        <Icon size={40} />
      </div>
      <h6>Verification Results</h6>
      {proccessing}
      {uploaded && (
        <LabelledValue label='Uploaded'>
          <p className={classnames(styles.RightAlign, styles.NoWrap)}>
            {formatDateTime(uploadDate)}
          </p>
        </LabelledValue>
      )}
      <LabelledValue label='Status'>
        <h6 className={styles.RightAlign}>
          {complete ? 'Completed' : 'Processing'}
        </h6>
      </LabelledValue>
      {download}
    </Panel>
  );
};

export default ListResultsCard;
