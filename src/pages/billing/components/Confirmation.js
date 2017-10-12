import React from 'react';
import { Panel, Button } from '@sparkpost/matchbox';
import config from 'src/config';

const Confirmation = ({ current = {}, selected = {}, disableSubmit, selfServe }) => {
  const isDowngrade = current.monthly > selected.monthly;
  const isPlanSelected = current.code !== selected.code;
  let effectiveDateMarkup = null;
  let ipMarkup = null;
  let addonMarkup = null;
  let currentPrice = '';
  let buttonText = '';

  if (!selfServe) {
    buttonText = 'Enable Automatic Billing';
  } else {
    buttonText = isDowngrade ? 'Downgrade Plan' : 'Upgrade Plan';
  }

  const selectedPrice = selected.monthly === 0
    ? 'for Free'
    : <span>for ${selected.monthly && selected.monthly.toLocaleString()}/mo</span>;

  if (current.monthly !== undefined) {
    currentPrice = current.monthly === 0
      ? 'for Free'
      : <span>for ${current.monthly && current.monthly.toLocaleString()}/mo</span>;
  }

  const selectedPlanMarkup = !isPlanSelected
    ? <p>Select a plan on the left to update your subscription</p>
    : <div>
        <small>New Plan</small>
        <h5>{ selected.volume && selected.volume.toLocaleString() } emails { selectedPrice }</h5>
      </div>;

  if (isPlanSelected && selfServe) {
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
          <p>To remove dedicated IPs from your account, please <a href={`mailto:${config.contact.supportEmail}`}>contact our support team</a>.</p>
        </div>
      );
    }

    if (selected.isFree && selfServe) {
      addonMarkup = <p>This downgrade will remove all add-ons, including any dedicated IP addresses you may have purchased.</p>;
    }
  }

  return (
    <Panel>
      <Panel.Section>
        <small>Current Plan</small>
        <h4>{ current.volume && current.volume.toLocaleString() } emails { currentPrice }</h4>
      </Panel.Section>
      <Panel.Section>
        { selectedPlanMarkup }
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
};

export default Confirmation;
