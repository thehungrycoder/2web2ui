/* eslint max-lines: ["error", 200] */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Grid, Icon, Button, Tag } from '@sparkpost/matchbox';
import { listTrackingDomains, updateTrackingDomain, deleteTrackingDomain, verifyTrackingDomain } from 'src/actions/trackingDomains';
import { DeleteModal, ConfirmationModal } from 'src/components/modals';
import styles from './TrackingDomainRow.module.scss';
import DeleteButton from './DeleteButton';
import StatusTag from './StatusTag';

export function IsDefaultTag({ assignedToSubaccount }) {
  return <Tag orange className={styles.Tag}>{assignedToSubaccount && 'Subaccount '}Default</Tag>;
}
export function SubaccountTag({ id }) {
  return <Tag><Icon name='Link' /> Subaccount {id}</Tag>;
}

export class TrackingDomainRow extends Component {
  state = {
    deleteModalOpen: false,
    defaultModalOpen: false
  }

  toggleDeleteModal = () => {
    this.setState({ deleteModalOpen: !this.state.deleteModalOpen });
  }

  toggleDefaultModal = () => {
    this.setState({ defaultModalOpen: !this.state.defaultModalOpen });
  }

  delete = () => {
    const { domain, subaccountId, deleteTrackingDomain } = this.props;
    deleteTrackingDomain({ domain, subaccountId })
      .then(() => this.toggleDeleteModal());
  }

  update = (data) => {
    const { listTrackingDomains, updateTrackingDomain, domain, subaccountId: subaccount } = this.props;
    updateTrackingDomain({ domain, subaccount, ...data })
      .then(() => listTrackingDomains())
      .then(() => this.toggleDefaultModal());
  }

  retryVerification = () => {
    const { verifyTrackingDomain, domain, subaccountId } = this.props;
    verifyTrackingDomain({ domain, subaccountId });
  }

  renderDefaultOrVerifyButton() {
    const { verified, isDefault, verifying, domain } = this.props;
    if (verified) {
      return (
        <Button
          destructive={isDefault}
          size='small'
          onClick={this.toggleDefaultModal}>
          {isDefault ? 'Remove Default' : 'Set as Default'}
        </Button>
      );
    }
    const verifyText = verifying.indexOf(domain) >= 0 ? 'Verifying...' : 'Retry Verification';
    return (
      <Button size='small' onClick={this.retryVerification}><Icon name='Refresh' /> {verifyText}</Button>
    );
  }

  renderModals() {
    const { domain, isDefault, deleting, updating } = this.props;
    const { deleteModalOpen, defaultModalOpen } = this.state;

    return (
      <div>
        <DeleteModal
          open={deleteModalOpen}
          title={`Permanently delete ${domain}?`}
          content={<p>Any templates or transmissions that reference this domain will use the default tracking domain from now on.</p>}
          isPending={deleting}
          onDelete={this.delete}
          onCancel={this.toggleDeleteModal}
        />
        <ConfirmationModal
          open={defaultModalOpen}
          title={`Change default tracking domain (${domain})`}
          content={<p>{isDefault ? `Transmissions and templates that don't specify a tracking domain will no longer use ${domain}. Instead, they will use the system default until another default is selected.` : `Transmissions and templates that don't specify a tracking domain will now use ${domain}.`}</p>}
          isPending={updating}
          onConfirm={() => this.update({ default: !isDefault })}
          onCancel={this.toggleDefaultModal}
          confirmVerb={isDefault ? 'Unset Default' : 'Set as Default'}
        />
      </div>
    );
  }

  render() {
    const { domain, subaccountId, status, isDefault } = this.props;
    return (
      <Panel.Section className={styles.SpacedSection}>
        <Grid>
          <Grid.Column xs={12} md={9}>
            <h3 className={styles.DomainHeading}>{domain}</h3>
            <div className={styles.TagRow}>
              <StatusTag status={status} />
              {isDefault && <IsDefaultTag assignedToSubaccount={!!subaccountId} />}
              {subaccountId && <SubaccountTag id={subaccountId} />}
            </div>
          </Grid.Column>
          <Grid.Column xs={12} md={3}>
            <Button.Group className={styles.ButtonColumn}>
              {this.renderDefaultOrVerifyButton()}
              <DeleteButton status={status} onClick={this.toggleDeleteModal} />
            </Button.Group>
          </Grid.Column>
        </Grid>
        {this.renderModals()}
      </Panel.Section>
    );
  }
}

const mapStateToProps = (state, { domain, default: isDefault, subaccount_id: subaccountId }) => ({
  isDefault,
  subaccountId,
  updating: state.trackingDomains.updating === domain,
  deleting: state.trackingDomains.deleting === domain
});
export default connect(mapStateToProps, {
  listTrackingDomains,
  updateTrackingDomain,
  deleteTrackingDomain,
  verifyTrackingDomain
})(TrackingDomainRow);
