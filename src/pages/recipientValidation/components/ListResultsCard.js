import React from 'react';
import classnames from 'classnames';
import { Panel, Button } from '@sparkpost/matchbox';
import { InsertDriveFile, CheckCircleOutline } from '@sparkpost/matchbox-icons';
import DownloadLink from 'src/components/downloadLink/DownloadLink';
import LabelledValue from 'src/components/labelledValue/LabelledValue';
import { LoadingSVG } from 'src/components/loading/Loading';
import { formatDateTime } from 'src/helpers/date';
import moment from 'moment';
import styles from './ListResultsCard.module.scss';

const ListResultsCard = ({ complete = 'unknown', uploaded, rejectedUrl }) => {
  if (complete === 'unknown') {
    return (
      <Panel>
        <div className={styles.LoadingWrapper}><LoadingSVG size='Small' /></div>
      </Panel>
    );
  }

  const Icon = complete
    ? CheckCircleOutline
    : InsertDriveFile;

  const proccessing = !complete
    ? <div className={styles.ProcessingWrapper}><LoadingSVG size='Small' /></div>
    : <div className={styles.Spacer}/>;

  const download = complete && (
    <DownloadLink component={Button} to={rejectedUrl} fullWidth color='orange'>Download Rejected Recipients</DownloadLink>
  );

  return (
    <Panel sectioned>
      <div className={classnames(styles.IconWrapper, complete && styles.Complete)}>
        <Icon size={40} />
      </div>
      <h6>Validation Results</h6>
      {proccessing}
      {uploaded && (
        <LabelledValue label='Uploaded'>
          <p className={classnames(styles.RightAlign, styles.NoWrap)}>
            {formatDateTime(moment.unix(uploaded))}
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
