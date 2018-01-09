import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { Panel, Button } from '@sparkpost/matchbox';
import { BaseModal, LabelledValue, CopyField, LongTextContainer, Loading } from 'src/components';
import styles from './Detail.module.scss';

export class Detail extends Component {

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
    const { open, deleting, onCancel } = this.props;

    return (
      <BaseModal open={open}>
        <Panel title={'Suppression Details'} accent sectioned>
          { deleting ? <div className={styles.Loading}><Loading /></div> : this.renderContents()}
          <Button onClick={() => { onCancel(); }} className={styles.Cancel}>Close</Button>
        </Panel>
      </BaseModal>
    );
  }
}

const mapStateToProps = (state, props) => ({ suppression: props.suppression });
export default connect(mapStateToProps, {})(Detail);
