/* eslint max-lines: ["error", 200] */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Grid, Icon, Button, Tag, Tooltip } from '@sparkpost/matchbox';
import { deleteTrackingDomain, verifyTrackingDomain } from 'src/actions/trackingDomains';
import { DeleteModal, ConfirmationModal } from 'src/components/modals';
import styles from './TrackingDomainRow.module.scss';

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

  handleDelete = () => {
    const { domain, subaccountId, deleteTrackingDomain } = this.props;
    deleteTrackingDomain({ domain, subaccountId });
    this.toggleDeleteModal();
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

  renderDeleteButton() {
    const { status } = this.props;
    if (status === 'pending' || status === 'blocked') {
      return null;
    }
    return <Button destructive size='small' onClick={this.toggleDeleteModal}>Delete</Button>;
  }

  renderStatusTag() {
    switch (this.props.status) {
      case 'blocked':
        return (
          <Tooltip
            content='This domain is not available for use. For more information, please contact support.'
            dark>
            <Tag className={styles.Tag}>Blocked</Tag>
          </Tooltip>
        );

      case 'pending':
        return (
          <Tooltip
            content='This domain is pending review, please check back again soon.'
            dark>
            <Tag className={styles.Tag}>Pending</Tag>
          </Tooltip>
        );

      case 'unverified':
        return <Tag className={styles.Tag} yellow>Unverified</Tag>;

      default:
        return null;
    }
  }

  handleChangeDefault() {
    //TODO implement this
  }

  renderModals() {
    const { domain, isDefault } = this.props;
    const { deleteModalOpen, defaultModalOpen } = this.state;

    return (
      <div>
        <DeleteModal
          open={deleteModalOpen}
          title={`Permanently delete ${domain}?`}
          content={<p>Any templates or transmissions that reference this domain will use the default tracking domain from now on.</p>}
          onDelete={this.handleDelete}
          onCancel={this.toggleDeleteModal}
        />
        <ConfirmationModal
          open={defaultModalOpen}
          title={`Change default tracking domain (${domain})`}
          content={<p>{isDefault ? `Transmissions and templates that don't specify a tracking domain will no longer use ${domain}. Instead, they will use the system default until another default is selected.` : `Transmissions and templates that don't specify a tracking domain will now use ${domain}.`}</p>}
          onConfirm={this.handleChangeDefault}
          onCancel={this.toggleDefaultModal}
          confirmVerb={isDefault ? 'Unset Default' : 'Set as Default'}
        />
      </div>
    );
  }

  render() {
    const { domain, subaccountId, isDefault } = this.props;
    return (
      <Panel.Section className={styles.SpacedSection}>
        <Grid>
          <Grid.Column xs={12} md={9}>
            <h3 className={styles.DomainHeading}>{domain}</h3>
            <div className={styles.TagRow}>
              {this.renderStatusTag()}
              {isDefault && <IsDefaultTag assignedToSubaccount={!!subaccountId} />}
              {subaccountId && <SubaccountTag id={subaccountId} />}
            </div>
          </Grid.Column>
          <Grid.Column xs={12} md={3}>
            <Button.Group className={styles.ButtonColumn}>
              {this.renderDefaultOrVerifyButton()}
              {this.renderDeleteButton()}
            </Button.Group>
          </Grid.Column>
        </Grid>
        {this.renderModals()}
      </Panel.Section>
    );
  }
}

const mapStateToProps = (state, { default: isDefault, subaccount_id: subaccountId }) => ({ isDefault, subaccountId });
export default connect(mapStateToProps, {
  deleteTrackingDomain,
  verifyTrackingDomain
})(TrackingDomainRow);
