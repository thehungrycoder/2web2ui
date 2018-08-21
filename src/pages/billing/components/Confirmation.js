import React from 'react';
import { Panel, Button } from '@sparkpost/matchbox';
import config from 'src/config';
import { getPlanPrice } from 'src/helpers/billing';
import PlanPrice from 'src/components/billing/PlanPrice';
import SupportTicketLink from 'src/components/supportTicketLink/SupportTicketLink';
import Brightback from 'src/components/brightback/Brightback';

export class Confirmation extends React.Component {
  renderSelectedPlanMarkup() {
    const { current = {}, selected = {}} = this.props;

    return !selected || selected.code === current.code
      ? <p>Select a plan on the left to update your subscription</p>
      : <div>
        <small>New Plan</small>
        <h5><PlanPrice plan={selected}/></h5>
      </div>;
  }

  renderCurrentPlanMarkup() {
    const { current } = this.props;
    return (
      <span>
        <small>Current Plan</small>
        <h4><PlanPrice plan={current}/></h4>
      </span>
    );
  }

  render() {
    const { current = {}, selected = {}, disableSubmit, billingEnabled } = this.props;
    const currentPlanPricing = getPlanPrice(current);
    const selectedPlanPricing = getPlanPrice(selected);
    const isDowngrade = currentPlanPricing.price > selectedPlanPricing.price;
    const isPlanSelected = current.code !== selected.code;
    let effectiveDateMarkup = null;
    let ipMarkup = null;
    let addonMarkup = null;
    let buttonText = '';

    if (!billingEnabled) {
      buttonText = 'Enable Automatic Billing';
    } else {
      buttonText = isDowngrade ? 'Downgrade Plan' : 'Upgrade Plan';
    }

    if (isPlanSelected && billingEnabled) {
      if (isDowngrade) {
        effectiveDateMarkup =
          <p>Your downgrade will take effect at the end of the current billing cycle. You will not be able to make any
            plan changes until your downgrade takes effect.</p>;
      } else {
        effectiveDateMarkup = current.isFree
          ? <p>Your upgrade will be effective today.</p>
          : <p>Your upgrade will be effective today and you'll be billed a pro-rated amount for your current billing
          cycle.</p>;
      }

      if (isDowngrade && current.includesIp && !selected.includesIp && !selected.isFree) {
        ipMarkup = (
          <div>
            <p>Note: your current plan includes a free dedicated IP address.</p>
            <p>If you downgrade to the selected plan, you will lose that discount and will be charged the standard
              ${config.sendingIps.pricePerIp} / month price for each dedicated IP on your next statement.</p>
            <p>
              To remove dedicated IPs from your account, please {
                <SupportTicketLink issueId="general_issue">
                  submit a support ticket
                </SupportTicketLink>
              }.
            </p>
          </div>
        );
      } else if (!isDowngrade && selected.includesIp && !current.includesIp) {
        ipMarkup = (
          <div>
            <p>{'A free dedicated IP address will be added to your default IP pool.'}</p>
          </div>
        );
      }

      if (selected.isFree && billingEnabled) {
        addonMarkup =
          <p>This downgrade will remove all add-ons, including any dedicated IP addresses you may have purchased.</p>;
      }
    }

    return (
      <Panel>
        <Panel.Section>
          {this.renderCurrentPlanMarkup()}
        </Panel.Section>
        <Panel.Section>
          {this.renderSelectedPlanMarkup()}
          {effectiveDateMarkup}
          {ipMarkup}
          {addonMarkup}
        </Panel.Section>
        <Panel.Section>
          <Brightback
            enabled={billingEnabled && isPlanSelected && selected.isFree}
            render={({ buttonProps }) => (
              <Button
                type='submit'
                fullWidth
                primary={!isDowngrade}
                destructive={isDowngrade}
                disabled={disableSubmit}
                {...buttonProps}>
                  {buttonText}
              </Button>
          )}/>
        </Panel.Section>
      </Panel>
    );
  }
}

export default Confirmation;
