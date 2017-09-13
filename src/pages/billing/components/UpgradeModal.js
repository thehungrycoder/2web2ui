import React, { Component } from 'react';
import _ from 'lodash';

import { Panel, Button, Modal, Table } from '@sparkpost/matchbox';
import CreditCardForm from './CreditCardForm';
import PlanCompareGrid from './PlanCompareGrid';

const PlanRow = ({ plan, handleClick }) => {
  const rowOnClick = () => {
    handleClick(plan);
  };

  plan.button = <Button onClick={rowOnClick}>Select</Button>;
  plan.monthly = plan.monthly ? plan.monthly : 0;
  plan.overage = plan.overage ? plan.overage : 'N/A';

  return (
    <Table.Row rowData={ [ plan.name, `$${plan.monthly.toLocaleString()}/mo`, plan.volume.toLocaleString(), plan.overage.toLocaleString(), plan.button ]}/>
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

  renderPlanRows(plans, currentPlan) {
    // remove currentPlan from rows TODO: replace with a different "your plan" row
    _.remove(plans, (plan) => plan.code === currentPlan.code);

    return plans.map((plan) => (
        <PlanRow key={plan.code} plan={plan} handleClick={this.toggleCreditCardForm}/>
      ));
  }

  renderPlansTable() {
    const { plans, currentPlan } = this.props;

    return (
      <Table>
        <thead>
          <Table.Row>
            <Table.HeaderCell>Plan</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Emails</Table.HeaderCell>
            <Table.HeaderCell>Overage</Table.HeaderCell>
          </Table.Row>
        </thead>
        <tbody>
          { this.renderPlanRows(plans, currentPlan) }
        </tbody>
      </Table>
    );
  }

  renderCreditCardForm() {
    const { selectedPlan } = this.state;
    const { currentPlan, updatePlan, currentUser, countries, hasBilling } = this.props;

    return (
      <div>
          <PlanCompareGrid
            currentPlan={currentPlan}
            selectedPlan={selectedPlan}
          />
          <CreditCardForm
            onSubmit={updatePlan}
            backToPlans={this.toggleCreditCardForm}
            currentUser={currentUser}
            selectedPlan={selectedPlan}
            countries={countries}
            hasBilling={hasBilling} />
        </div>
    );
  }

  render() {
    const { open, handleToggle } = this.props;
    const panelActions = [{ content: 'Cancel', onClick: handleToggle }];

    return (
      <Modal open={open}>
        <Panel title={'Change your Plan'} sectioned actions={panelActions}>
          <Panel.Section>
            { this.state.showCreditCardForm
              ? this.renderCreditCardForm()
              : this.renderPlansTable() }
          </Panel.Section>
        </Panel>
      </Modal>
    );
  }
}

export default UpgradeModal;
