import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Panel, ProgressBar, Button } from '@sparkpost/matchbox';
import styles from './UsageReport.module.scss';
import classnames from 'classnames';

const actions = [
  {
    content: 'What counts towards usage?',
    to: 'https://support.sparkpost.com/customer/portal/articles/2750871',
    external: true
  }
];

const getPercent = (used, volume) => Math.floor((volume / used) * 100);

const DisplayNumber = ({ label, content, orange }) => (
  <div className={styles.Display}>
    <h5 className={classnames(styles.Content, orange && styles.orange)}>{ content }</h5>
    <h6 className={styles.Label}>{ label }</h6>
  </div>
);

const ProgressLabel = ({ title, secondaryTitle }) => (
    <div>
      <h5 className={styles.ProgressTitle}>{ title }</h5>
      <h6 className={styles.ProgressSecondary}>{ secondaryTitle }</h6>
    </div>
);

class UsageReport extends Component {
  render () {
    const { subscription, usage } = this.props;

    if (!subscription || !usage) {
      return null;
    }

    const dayStart = usage.day.start
      ? `Since ${usage.day.start}`
      : null;

    const monthCycle = usage.month.start && usage.month.end
      ? `Billing cycle: ${usage.month.start} - ${usage.month.end}`
      : null;

    const remaining = subscription.plan_volume - usage.month.used;
    const overage = remaining < 0
      ? Math.abs(remaining)
      : 0;
    const monthlyUsage = getPercent(subscription.plan_volume, usage.month.used);
    const dailyUsage = getPercent(usage.day.limit, usage.day.used);

    const dailyLimitMarkup = usage.day.limit
      ? <DisplayNumber label='Daily Limit' content={usage.day.limit.toLocaleString()}/>
      : null;
    const overageMarkup = overage
      ? <DisplayNumber label='Extra Emails Used' content={overage.toLocaleString()}/>
      : null;

    const monthlyLimitMarkup = usage.month.limit && usage.month.limit !== subscription.plan_volume
      ? <DisplayNumber label='Monthly limit' content={usage.month.limit.toLocaleString()} />
      : null;

    return (
      <Panel title='Your Usage Report' actions={actions}>
        <Panel.Section>
          <ProgressLabel title='Today' secondaryTitle={dayStart} />
          <ProgressBar completed={dailyUsage} />
          <DisplayNumber label='Used' content={usage.day.used.toLocaleString()} orange />
          { dailyLimitMarkup }
        </Panel.Section>
        <Panel.Section>
          <ProgressLabel title='This Month' secondaryTitle={monthCycle} />
          <ProgressBar completed={monthlyUsage} />
          <DisplayNumber label='Used' content={usage.month.used.toLocaleString()} orange />
          <DisplayNumber label='Included' content={subscription.plan_volume.toLocaleString()}/>
          { overageMarkup }
          { monthlyLimitMarkup }
        </Panel.Section>
      </Panel>
    );
  }
}

const mapStateToProps = ({ account: { usage, subscription } }) => ({ usage, subscription });
export default connect(mapStateToProps)(UsageReport);
