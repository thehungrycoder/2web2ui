import React, { Component } from 'react';

import { Panel, Button } from '@sparkpost/matchbox';
import { Modal, LabelledValue, CopyField, LongTextContainer } from 'src/components';
import { formatDateTime } from 'src/helpers/date';
import { formatSubaccountDisplay } from '../helpers';
import styles from './Detail.module.scss';

export default class Detail extends Component {
  renderContents = () => {
    const { suppression, subaccounts: allSubaccounts, hasSubaccounts } = this.props;

    return (
      <div>
        <LabelledValue key='recipient' label='Recipient' value={suppression.recipient} />
        <LabelledValue key='type' label='Type' value={suppression.type === 'transactional' ? 'Transactional' : 'Non-transactional'} />
        <LabelledValue key='source' label='Source' value={suppression.source} />
        <LabelledValue key='updated' label='Updated' value={formatDateTime(suppression.updated)} />
        { hasSubaccounts &&
          <LabelledValue key='subaccount' label='Subaccount' value={formatSubaccountDisplay(suppression.subaccount_id, allSubaccounts)} />
        }
        <LabelledValue key='created' label='Created' value={formatDateTime(suppression.created)} />
        <LabelledValue key='description' label='Description' value={<LongTextContainer text={suppression.description} />} />
        <LabelledValue key='raw json' label='Raw JSON' value={<CopyField value={JSON.stringify(suppression)} /> } />
      </div>
    );
  }

  render() {
    const { open, onCancel, suppression } = this.props;

    return (
      <Modal open={open} onClose={onCancel}>
        <Panel title='Suppression Details' accent sectioned>
          {suppression && this.renderContents()}
          <div className={styles.Buttons}>
            <Button onClick={onCancel} >Close</Button>
          </div>
        </Panel>
      </Modal>
    );
  }
}
