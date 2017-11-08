export default function(state) {
  const { metrics, templates, subaccounts, sendingDomains } = state;

  if (!templates.list || !subaccounts.list || !sendingDomains.list) {
    return [];
  }

  const {
    domains = [],
    campaigns = [],
    sendingIps = [],
    ipPools = []
  } = metrics;

  return [
    ...reshape(domains, 'Domain'),
    ...reshape(campaigns, 'Campaign'),
    ...reshape(sendingIps, 'Sending IP'),
    ...reshape(ipPools, 'IP Pool'),
    ...reshapeTemplates(templates.list),
    ...reshapeSubaccounts(subaccounts.list),
    ...reshapeSendingDomains(sendingDomains.list)
  ];
}

function reshape(list, type) {
  return list.map((value) => ({ type, value }));
}

function reshapeTemplates(templates) {
  const type = 'Template';
  return templates.map((t) => ({ type, value: t.id }));
}

function reshapeSubaccounts(subaccounts) {
  const type = 'Subaccount';
  return subaccounts.map((s) => ({ type, value: `${s.name} (ID ${s.id})`, id: s.id }));
}

function reshapeSendingDomains(domains) {
  const type = 'Sending/Bounce Domain';
  return domains.map((d) => ({ type, value: d.domain }));
}
