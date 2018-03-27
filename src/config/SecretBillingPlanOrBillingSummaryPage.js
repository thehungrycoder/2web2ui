import React from 'react';
import qs from 'query-string';
import { Redirect } from 'react-router-dom';

import SummaryPage from 'src/pages/billing/SummaryPage';

// TODO: This type of logic needs to be built into our routing
export default function SecretBillingPlanOrBillingSummaryPage(props) {
  const search = qs.parse(props.location.search);

  if (search.plan) {
    return <Redirect to={`/account/billing/plan?code=${search.plan}`} />;
  }

  return <SummaryPage {...props} />;
}
