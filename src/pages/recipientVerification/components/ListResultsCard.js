import React from 'react';
import classnames from 'classnames';
import { Panel, Button } from '@sparkpost/matchbox';
import { InsertDriveFile, CheckCircleOutline } from '@sparkpost/matchbox-icons';
// import DownloadLink from 'src/components/downloadLink/DownloadLink';
import LabelledValue from 'src/components/labelledValue/LabelledValue';
import { LoadingSVG } from 'src/components/loading/Loading';
import { formatDateTime } from 'src/helpers/date';
import styles from './ListResultsCard.module.scss';

const ListResultsCard = ({ complete, upload_timestamp, file }) => {
  const Icon = complete
    ? CheckCircleOutline
    : InsertDriveFile;

  const loading = !complete
    ? <div className={styles.LoadingWrapper}><LoadingSVG small /></div>
    : <div className={styles.Spacer}/>;

  const download = complete
    ? <Button fullWidth color='orange'>Download Rejected Recipients</Button>
    : null;

  return (
    <Panel sectioned>
      <div className={classnames(styles.IconWrapper, complete && styles.Complete)}>
        <Icon size={40} />
      </div>
      <h6>Verification Results</h6>
      {loading}
      {/* BUG: API not returning timestamp sometimes? */}
      {upload_timestamp && (
        <LabelledValue label='Uploaded'>
          <p className={styles.RightAlign}>
            {formatDateTime(upload_timestamp)}
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
