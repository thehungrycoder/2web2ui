import React, { Component } from 'react';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import classnames from 'classnames';
import { fetch as getAccount } from 'src/actions/account';
import PanelLoading from 'src/components/panelLoading/PanelLoading';

import { Panel, ProgressBar } from '@sparkpost/matchbox';
import styles from './UsageReport.module.scss';
import { LINKS } from 'src/constants';
import SendMoreCTA from './SendMoreCTA';

const actions = [
  {
    content: 'What counts towards usage?',
    to: LINKS.DAILY_USAGE,
    external: true
  }
];

const getPercent = (used, limit) => Math.floor((used / limit) * 100);

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

export class UsageReport extends Component {
  componentDidMount() {
    this.props.getAccount({ include: 'usage' });
  }
  render() {
    const { subscription, usage } = this.props;

    if (!subscription || !usage) {
      return <PanelLoading />;
    }

    const remaining = subscription.plan_volume - usage.month.used;
    const overage = remaining < 0 ? Math.abs(remaining) : 0;

    const dailyUsage = getPercent(usage.day.used, usage.day.limit);

    const monthlyLimit = usage.month.limit || subscription.plan_volume;
    const monthlyUsage = getPercent(usage.month.used, monthlyLimit);

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

          <ProgressLabel
            title='Today'
            secondaryTitle={`Since ${format(usage.day.start, 'MMMM Do, YYYY h:mma')}`}
          />
          <ProgressBar completed={dailyUsage} />
          <DisplayNumber label='Used' content={usage.day.used.toLocaleString()} orange />
          { dailyLimitMarkup }

          <div><SendMoreCTA /></div>
        </Panel.Section>
        <Panel.Section>

          <ProgressLabel
            title='This Month'
            secondaryTitle={`Billing cycle: ${format(usage.month.start, 'MMMM D')} - ${format(usage.month.end, 'MMMM D')}`}
          />
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

const mapStateToProps = ({ account: { usage, subscription }}) => ({ usage, subscription });
export default connect(mapStateToProps, { getAccount })(UsageReport);
