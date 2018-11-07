const assignedTo = ({ shared_with_subaccounts, subaccount_id }) => {
  if (subaccount_id) {
    return 'subaccount';
  }

  return shared_with_subaccounts ? 'shared' : 'master';
};

export default assignedTo;
