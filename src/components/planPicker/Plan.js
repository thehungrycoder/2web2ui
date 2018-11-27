import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import PlanPrice from 'src/components/billing/PlanPrice';
import styles from './PlanPicker.module.scss';

class Plan extends React.Component {
  render() {
    const { plan, className, ...rest } = this.props;

    return (
      <a className={className} {...rest} >
        <PlanPrice plan={plan} showOverage showIp showCsm className={styles.MainLabel} />
      </a>
    );
  }
}

function eitherMonthlyOrHourly(props, propName, componentName) {
  const hasMonthly = _.has(props, 'monthly');
  const hasHourly = _.has(props, 'hourly');

  if (props.status !== 'public' && props.status !== 'secret') {
    return;
  }

  // If both are provided, or neither, error
  if ((hasMonthly && hasHourly) || !(hasMonthly || hasHourly)) {
    return new Error('Plan\'s pricing should either be hourly or monthly but not both');
  }
}

Plan.propTypes = {
  plan: PropTypes.shape({
    volume: PropTypes.number.isRequired,
    monthly: eitherMonthlyOrHourly,
    hourly: eitherMonthlyOrHourly,
    overage: PropTypes.number,
    includesIp: PropTypes.bool,
    isFree: PropTypes.bool
  }).isRequired
};

export default Plan;
