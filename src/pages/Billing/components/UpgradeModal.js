import React, { Component } from 'react';
import _ from 'lodash';

import { Panel, Button, Modal, Table } from '@sparkpost/matchbox';
import CreditCardForm from './CreditCardForm';
import PlanCompareGrid from './PlanCompareGrid';

const PlanRow = ({ plan, handleClick, currentVolume }) => {
  const rowOnClick = () => {
    handleClick(plan);
  };

  if (plan.volume < currentVolume) {
    plan.button = <Button onClick={rowOnClick}>Downgrade</Button>;
  } else {
    plan.button = <Button onClick={rowOnClick} primary>Upgrade</Button>;
  }

  plan.monthly = plan.monthly ? plan.monthly : 0;
  plan.overage = plan.overage ? plan.overage : 'N/A';

  return (
    <Table.Row rowData={ [ plan.name, '$' + plan.monthly.toLocaleString() + '/mo', plan.volume.toLocaleString(), plan.overage.toLocaleString(), plan.button ]}/>
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
    // remove currentPlan from rows TODO: replace with a different "your plan" row
    _.remove(plans, (plan) => {
      return plan.code === currentPlan.code;
    });

    return plans.map((plan) => {
      return (
        <PlanRow key={plan.code} plan={plan} currentVolume={currentPlan.volume} handleClick={this.toggleCreditCardForm}/>
      );
    });
  }

  render () {
    const { open, handleToggle, plans, currentPlan, freePlan, updatePlan, currentUser, countries, hasBilling } = this.props;

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
              <PlanCompareGrid
                currentPlan={currentPlan}
                selectedPlan={selectedPlan}
              />
              <CreditCardForm
                onSubmit={updatePlan}
                backToPlans={this.toggleCreditCardForm}
                currentUser={currentUser}
                billingId={selectedPlan.billingId}
                countries={countries}
                hasBilling={hasBilling} />
            </div>

            : <Table>
              <thead>
                <Table.Row>
                  <Table.HeaderCell>Plan</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Emails</Table.HeaderCell>
                  <Table.HeaderCell>Overage</Table.HeaderCell>
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
