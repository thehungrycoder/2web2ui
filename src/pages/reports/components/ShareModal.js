import React, { Component } from 'react';
import qs from 'query-string';
import { relativeDateOptions } from 'src/helpers/date';
import { Panel, Button, WindowEvent, Checkbox } from '@sparkpost/matchbox';
import { Modal, CopyField } from 'src/components';

export default class ShareModal extends Component {
  state = {
    pinned: true
  }

  getLink() {
    const { query } = this.props;
    const { pinned } = this.state;
    const modifiedQuery = { ...query };

    if (pinned) {
      modifiedQuery.range = 'custom';
    }

    if (modifiedQuery.range !== 'custom') {
      delete modifiedQuery.from;
      delete modifiedQuery.to;
    }

    const search = qs.stringify(modifiedQuery, { encode: false });
    const url = window.location.href.split('?')[0];

    return `${url}?${search}`;
  }

  renderPinToggle() {
    const { query } = this.props;
    const { pinned } = this.state;
    const relativeRange = relativeDateOptions.find((item) => item.value === query.range);
    const isRelative = relativeRange && query.range !== 'custom';

    if (!isRelative) {
      return null;
    }

    return (
      <div style={{ marginBottom: '30px' }}>
        <Checkbox
          id='pin-relative-link'
          label='Pin dates for this link'
          checked={pinned}
          onChange={() => this.setState({ pinned: !pinned })}
          helpText={<span>Pins this report's relative time range to its calculated dates (this is usually what you want when sharing a report).</span>}
        />
      </div>
    );
  }

  handleWindowClick = (e) => {
    const { handleToggle } = this.props;
    if (!e.modalClick) {
      handleToggle(e);
    }
  }

  handleKeydown = (e) => {
    const { handleToggle } = this.props;
    if (e.key === 'Escape' || e.key === 'Enter') {
      handleToggle(e);
    }
  }

  render() {
    const { open, handleToggle } = this.props;

    return (
      <Modal open={open} onClick={handleToggle}>
        {open && <WindowEvent event='keydown' handler={this.handleKeydown} />}
        <Panel title='Share this report' onClick={(e) => e.stopPropagation()}>
          <Panel.Section>
            <CopyField value={this.getLink()} />
            {this.renderPinToggle()}
            <Button primary onClick={handleToggle}>Done</Button>
          </Panel.Section>
        </Panel>
      </Modal>
    );
  }
}
