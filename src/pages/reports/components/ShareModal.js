/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { relativeDateOptions } from 'src/helpers/date';
import { Panel, Button, WindowEvent, Checkbox } from '@sparkpost/matchbox';
import { Modal, CopyField } from 'src/components';
import _ from 'lodash';

export class ShareModal extends Component {
  state = {
    pinned: true,
    open: false,
    searchOptions: {}
  }

  componentDidMount() {
    this.updateLink();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.searchOptions, this.props.searchOptions)) {
      this.updateLink();
    }
  }

  updateLink = () => {
    const { searchOptions, history, location } = this.props;
    // console.log(searchOptions);
    const search = qs.stringify(searchOptions, { encode: false });

    this.setState({ searchOptions });
    history.replace({ pathname: location.pathname, search });
  }

  getLink() {
    const { searchOptions, pinned } = this.state;
    const modifiedQuery = { ...searchOptions };

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

  handleKeydown = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      this.toggleModal(e);
    }
  }

  toggleModal = () => {
    this.setState({ open: !this.state.open });
  }

  renderPinToggle() {
    const { searchOptions, pinned } = this.state;
    const relativeRange = relativeDateOptions.find((item) => item.value === searchOptions.range);
    const isRelative = relativeRange && searchOptions.range !== 'custom';

    if (!isRelative) {
      return null;
    }

    return (
      <Checkbox
        id='pin-relative-link'
        label='Pin dates for this link'
        checked={pinned}
        onChange={() => this.setState({ pinned: !pinned })}
        helpText={<span>Pins this report's relative time range to its calculated dates (this is usually what you want when sharing a report).</span>}
      />
    );
  }

  render() {
    const { open } = this.state;

    return (
      <Fragment>
        <Button id='shareModalButton' disabled={this.props.disabled} fullWidth onClick={this.toggleModal}>Share</Button>
        <Modal open={open}>
          {open && <WindowEvent event='keydown' handler={this.handleKeydown} />}
          <Panel title='Share this report'>
            <Panel.Section>
              <CopyField value={this.getLink()} />
              {this.renderPinToggle()}
            </Panel.Section>
            <Panel.Section>
              <Button primary onClick={this.toggleModal}>Done</Button>
            </Panel.Section>
          </Panel>
        </Modal>
      </Fragment>
    );
  }
}

export default withRouter(connect(null, {})(ShareModal));
