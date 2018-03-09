import React from 'react';
import _ from 'lodash';
import { Panel, Button, UnstyledLink } from '@sparkpost/matchbox';
import config from 'src/config';

export class Confirmation extends React.Component {
  getPrice(plan) {
    const pricingInterval = _.has(plan, 'hourly') ? 'hourly' : 'monthly';
    const intervalShortName = pricingInterval === 'hourly' ? 'hr' : 'mo';
    const pricePerInterval = plan[pricingInterval];
    return pricePerInterval
      ? <span>for {pricePerInterval.toLocaleString()}/{intervalShortName}</span>
      : 'for Free';
  }

  getVolume(plan) {
    const pricingInterval = _.has(plan, 'hourly') ? 'hourly' : 'monthly';
    const intervalShortName = pricingInterval === 'hourly' ? 'hr' : 'mo';
    const pricePerInterval = plan[pricingInterval];
    return pricePerInterval
      ? <span>for {pricePerInterval.toLocaleString()}/{intervalShortName}</span>
      : 'for Free';
  }

  renderSelectedPlanMarkup(selectedPlan) {
    return !selectedPlan
      ? <p>Select a plan on the left to update your subscription</p>
      : <div>
        <small>New Plan</small>
        <h5>{ selectedPlan.volume && selectedPlan.volume.toLocaleString() } emails each month { this.getPrice(selectedPlan) }</h5>
      </div>;

  }

  renderCurrentPlanMarkup(currentPlan) {
    return (
      <span>
        <small>Current Plan</small>
        <h4>{ currentPlan.volume && currentPlan.volume.toLocaleString() } emails each month {this.getPrice(currentPlan)}</h4>
      </span>
    );
  }

  render() {
    const { current = {}, selected = {}, disableSubmit, billingEnabled } = this.props;
    const isDowngrade = current.monthly > selected.monthly;
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
      if (!isDowngrade) {
        effectiveDateMarkup = current.isFree
          ? <p>Your upgrade will be effective today.</p>
          : <p>Your upgrade will be effective today and you'll be billed a pro-rated amount for your current billing cycle.</p>;
      } else {
        effectiveDateMarkup = <p>Your downgrade will take effect at the end of the current billing cycle. You will not be able to make any plan changes until your downgrade takes effect.</p>;
      }

      if (current.includesIp && !selected.includesIp && !selected.isFree) {
        ipMarkup = (
          <div>
            <p>Note: your current plan includes a free dedicated IP address.</p>
            <p>If you downgrade to the selected plan, you will lose that discount and will be charged the standard ${ config.sendingIps.pricePerIp } / month price for each dedicated IP on your next statement.</p>
            <p>To remove dedicated IPs from your account, please <UnstyledLink to={`mailto:${config.contact.supportEmail}`}>contact our support team</UnstyledLink>.</p>
          </div>
        );
      }

      if (selected.isFree && billingEnabled) {
        addonMarkup = <p>This downgrade will remove all add-ons, including any dedicated IP addresses you may have purchased.</p>;
      }
    }

    return (
      <Panel>
        <Panel.Section>
          { this.renderCurrentPlanMarkup(current) }
        </Panel.Section>
        <Panel.Section>
          { this.renderSelectedPlanMarkup(selected) }
          { effectiveDateMarkup }
          { ipMarkup }
          { addonMarkup }
        </Panel.Section>
        <Panel.Section>
          <Button
            type='submit'
            fullWidth
            primary={!isDowngrade}
            destructive={isDowngrade}
            disabled={disableSubmit}>
            { buttonText }
          </Button>
        </Panel.Section>
      </Panel>
    );
  }
}

export default Confirmation;
