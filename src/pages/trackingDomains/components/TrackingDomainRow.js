import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Grid, Icon, Button, Tag } from '@sparkpost/matchbox';
import { deleteTrackingDomain, verifyTrackingDomain } from 'src/actions/trackingDomains';
import { DeleteModal, ConfirmationModal } from 'src/components/modals';
import styles from './TrackingDomainRow.module.scss';

const IsDefaultTag = ({ subaccount }) => <span style={{ marginRight: '10px' }}><Tag primary>{subaccount && 'Subaccount '}Default</Tag></span>;
const SubaccountTag = ({ id }) => <Tag outline><Icon name='Link' /> Subaccount {id}</Tag>;

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
    const { domain, subaccount_id: subaccountId, deleteTrackingDomain } = this.props;
    deleteTrackingDomain({ domain, subaccountId });
    this.toggleDeleteModal();
  }

  retryVerification = () => {
    const { verifyTrackingDomain, domain, subaccount_id: subaccountId } = this.props;
    verifyTrackingDomain({ domain, subaccountId });
  }

  renderDefaultOrVerifyButton() {
    const { verified, isDefault, verifying, domain } = this.props;
    if (verified) {
      return (
        <Button
          destructive={isDefault}
          onClick={this.toggleDefaultModal}>
          {isDefault ? 'Remove Default' : 'Set as Default'}
        </Button>
      );
    }
    const verifyText = verifying.indexOf(domain) >= 0 ? 'Verifying...' : 'Retry Verification';
    return (
      <Button onClick={this.retryVerification}><Icon name='Refresh' /> {verifyText}</Button>
    );
  }

  renderDeleteButton() {
    const { status } = this.props;
    if (status === 'pending' || status === 'blocked') {
      return null;
    }
    return <Button destructive onClick={this.toggleDeleteModal}>Delete</Button>;
  }

  renderIcon() {
    const { verified, status } = this.props;

    if (status === 'pending') {
      return <Icon className={styles.IconInfo} name='Clock' size={25} />;
    }

    if (status === 'blocked') {
      return <Icon className={styles.IconDanger} name='CloseCircle' size={25} />;
    }

    if (!verified) {
      return <Icon className={styles.IconWarning} name='Error' size={25} />;
    }

    return <Icon className={styles.IconSuccess} name='Check' size={25} />;
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
    const { domain, status, subaccount_id: subaccountId, isDefault } = this.props;
    return (
      <Panel.Section>
        <Grid>
          <Grid.Column xs={1}>
            {this.renderIcon()}
          </Grid.Column>
          <Grid.Column xs={11} md={7}>
            <h3 className={styles.DomainHeading}>{domain}</h3>
            {status === 'pending' && <p>This domain is pending review, please check back again soon.</p>}
            {status === 'blocked' && <p>This domain is not available for use. Please contact support if you have questions.</p>}
            <div>
              {isDefault && <IsDefaultTag subaccount={!!subaccountId} />}
              {subaccountId && <SubaccountTag id={subaccountId} />}
            </div>
          </Grid.Column>
          <Grid.Column xs={11} md={4}>
            <Button.Group className={styles.ButtonColumn}>
              {this.renderDefaultOrVerifyButton()}
              {this.renderDeleteButton()}
            </Button.Group>
          </Grid.Column>
        </Grid>
        {this.renderModals()};
      </Panel.Section>
    );
  }
}

const mapStateToProps = (state, { default: isDefault }) => ({ isDefault });
export default connect(mapStateToProps, {
  deleteTrackingDomain,
  verifyTrackingDomain
})(TrackingDomainRow);
