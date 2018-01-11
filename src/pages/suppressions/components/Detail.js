import React, { Component } from 'react';
import _ from 'lodash';

import { Panel, Button } from '@sparkpost/matchbox';
import { BaseModal, LabelledValue, CopyField, LongTextContainer } from 'src/components';
import styles from './Detail.module.scss';

export default class Detail extends Component {
  renderContents = () => {
    const { suppression } = this.props;

    const elements = [];
    _.forEach(suppression, (val, key) => {
      val = (val || '').toString();
      if (key === 'description') {
        val = <LongTextContainer text={val} />;
      }

      elements.push(<LabelledValue key={key} label={key} value={val}/>);
    });

    elements.push(<LabelledValue key='raw json' label='raw json' value={<CopyField value={JSON.stringify(suppression)} />}/>);
    return elements;
  }

  render() {
    const { open, onCancel } = this.props;

    return (
      <BaseModal open={open}>
        <Panel title={'Suppression Details'} accent sectioned>
          {this.renderContents()}
          <div className={styles.Buttons}>
            <Button onClick={() => { onCancel(); }} >Close</Button>
          </div>
        </Panel>
      </BaseModal>
    );
  }
}
