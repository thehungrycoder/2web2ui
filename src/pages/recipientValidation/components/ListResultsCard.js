import React from 'react';
import classnames from 'classnames';
import { Panel, Button } from '@sparkpost/matchbox';
import { ErrorOutline, InsertDriveFile, CheckCircleOutline } from '@sparkpost/matchbox-icons';
import DownloadLink from 'src/components/downloadLink/DownloadLink';
import LabelledValue from 'src/components/labelledValue/LabelledValue';
import { LoadingSVG } from 'src/components/loading/Loading';
import { formatDateTime } from 'src/helpers/date';
import moment from 'moment';
import styles from './ListResultsCard.module.scss';

const ListResultsCard = ({ complete = 'unknown', uploaded, rejectedUrl, status }) => {
  if (complete === 'unknown') {
    return (
      <Panel>
        <div className={styles.LoadingWrapper}><LoadingSVG size='Small' /></div>
      </Panel>
    );
  }

  const loading = !complete && status !== 'ERROR';
  const ready = status === 'SUCCESS';
  const failed = status === 'ERROR';

  let spinner = <div className={styles.Spacer}/>;
  let Icon = InsertDriveFile;
  let iconClass = null;
  let statusText = null;

  if (loading) {
    spinner = <div className={styles.ProcessingWrapper}><LoadingSVG size='Small' /></div>;
    statusText = 'Processing';
  }

  if (failed) {
    Icon = ErrorOutline;
    iconClass = styles.Failed;
    statusText = 'Failed. Please try again.';
  }

  if (ready) {
    Icon = CheckCircleOutline;
    iconClass = styles.Complete;
    statusText = 'Completed';
  }

  return (
    <Panel sectioned>
      <div className={classnames(styles.IconWrapper, iconClass)}>
        <Icon size={40} />
      </div>
      <h6>Validation Results</h6>
      {spinner}
      {uploaded && (
        <LabelledValue label='Uploaded'>
          <p className={classnames(styles.RightAlign, styles.NoWrap)}>
            {formatDateTime(moment.unix(uploaded))}
          </p>
        </LabelledValue>
      )}
      <LabelledValue label='Status'>
        <h6 className={styles.RightAlign}>
          {statusText}
        </h6>
      </LabelledValue>
      {ready && (
        <DownloadLink component={Button} to={rejectedUrl} fullWidth color='orange'>Download Rejected Recipients</DownloadLink>
      )}
    </Panel>
  );
};

export default ListResultsCard;
