import React, { Component } from 'react';
import _ from 'lodash';

import { Panel, Button, Modal, Table, Grid } from '@sparkpost/matchbox';
import CreditCardForm from './CreditCardForm';

const PlanRow = (props) => {
  const { plan, handleClick, currentVolume } = props;

  const rowOnClick = () => {
    handleClick(plan);
  };

  if (plan.volume < currentVolume) {
    plan.button = <Button onClick={rowOnClick}>Downgrade</Button>;
  } else {
    plan.button = <Button onClick={rowOnClick} primary>Upgrade</Button>;
  }

  return (
    <Table.Row rowData={ [ plan.name, plan.monthly + '/mo', plan.volume.toLocaleString(), plan.overage, plan.button ]}/>
  );
};

class UpgradeModal extends Component {
  state = {
    showCreditCardForm: false,
    selectedPlan: {}
  }

  toggleCreditCardForm = (selectedPlan = {}) => {
    this.setState({
      showCreditCardForm: !this.state.showCreditCardForm,
      selectedPlan: selectedPlan
    });
  }

  renderPlanRows (plans, currentPlan) {
    // remove currentPlan
    // TODO: replace with a your plan row
    _.remove(plans, (plan) => {
      return plan.code === currentPlan.code;
    });

    // set missing values for free plan
    const freePlan = _.find(plans, { 'name': 'Free' });
    if (freePlan) {
      freePlan.monthly = '0';
      freePlan.overage = 'N/A';
    }

    return plans.map((plan) => {
      return (
        <PlanRow key={plan.code} plan={plan} currentVolume={currentPlan.volume} handleClick={this.toggleCreditCardForm}/>
      );
    });
  }

  render () {
    const { open, handleToggle, plans, currentPlan, freePlan, updatePlan, currentUser } = this.props;

    const planRows = this.renderPlanRows(plans, currentPlan);
    const panelActions = [{ content: 'Cancel', onClick: handleToggle }];
    const title = freePlan ? 'Upgrade' : 'Change your Plan';
    const { selectedPlan } = this.state;

    return (
      <Modal open={open}>
        <Panel title={title} sectioned actions={panelActions}>
          <Panel.Section>
            { this.state.showCreditCardForm

            ? <div>
              <Grid>
                <Grid.Column xs={2}>
                  <p>
                    <br/>
                    Plan: <br/>
                    Price: <br/>
                    Emails: <br/>
                    Overage*: <br/>
                  </p>
                </Grid.Column>
                <Grid.Column>
                  Current Plan <br/>
                  {currentPlan.name} <br/>
                  ${currentPlan.monthly.toLocaleString()}/mo <br/>
                  {currentPlan.volume.toLocaleString()} <br/>
                  {currentPlan.overage.toLocaleString()}
                </Grid.Column>
                <Grid.Column>
                  New Plan <br/>
                  {selectedPlan.name} <br/>
                  ${selectedPlan.monthly.toLocaleString()}/mo <br/>
                  {selectedPlan.volume.toLocaleString()} <br/>
                  {selectedPlan.overage.toLocaleString()}
                </Grid.Column>
              </Grid>
              <CreditCardForm
                onSubmit={updatePlan}
                backToPlans={this.toggleCreditCardForm}
                currentUser={currentUser}
                billingId={selectedPlan.billingId}
              />
            </div>

            : <Table>
              <thead>
                <Table.Row>
                  <Table.HeaderCell>Plan</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Emails</Table.HeaderCell>
                  <Table.HeaderCell>Overage*</Table.HeaderCell>
                </Table.Row>
              </thead>
              <tbody>
                { planRows }
              </tbody>
            </Table> }

          </Panel.Section>
        </Panel>
      </Modal>
    );
  }
}

export default UpgradeModal;
