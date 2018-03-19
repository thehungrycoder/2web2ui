import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { relativeDateOptions } from 'src/helpers/date';
import { getReportSearchOptions } from 'src/helpers/reports';
import { Panel, Button, WindowEvent, Checkbox } from '@sparkpost/matchbox';
import { Modal, CopyField } from 'src/components';

export class ShareModal extends Component {
  static defaultProps = {
    extraLinkParams: []
  }

  state = {
    pinned: true,
    open: false,
    query: ''
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reportOptions !== this.props.reportOptions) {
      this.updateLink();
    }
  }

  updateLink = () => {
    const { reportOptions, history, location, extraLinkParams } = this.props;
    const query = getReportSearchOptions(reportOptions, extraLinkParams);
    const search = qs.stringify(query, { encode: false });

    this.setState({ query });
    history.replace({ pathname: location.pathname, search });
  }

  getLink() {
    const { query, pinned } = this.state;
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

  handleKeydown = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      this.toggleModal(e);
    }
  }

  toggleModal = () => {
    this.setState({ open: !this.state.open });
  }

  renderPinToggle() {
    const { query, pinned } = this.state;
    const relativeRange = relativeDateOptions.find((item) => item.value === query.range);
    const isRelative = relativeRange && query.range !== 'custom';

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

const mapStateToProps = (state) => ({
  reportOptions: state.reportOptions
});

export default withRouter(connect(mapStateToProps, {})(ShareModal));
