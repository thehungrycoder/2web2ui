const accountSingleSignOnReducer = (state = {}, { payload, type, ...action }) => {
  switch (type) {
    case 'GET_ACCOUNT_SSO_DETAILS_FAIL':
      return { error: payload.error.message, loading: false };

    case 'GET_ACCOUNT_SSO_DETAILS_PENDING':
      return { loading: true };

    case 'UPDATE_ACCOUNT_SSO_FAIL':
      return { ...state, updateError: payload.error.message };

    case 'GET_ACCOUNT_SSO_DETAILS_SUCCESS':
    case 'PROVISION_ACCOUNT_SSO_SUCCESS':
    case 'REPROVISION_ACCOUNT_SSO_SUCCESS':
    case 'UPDATE_ACCOUNT_SSO_SUCCESS': {
      const { cert, enabled, provider, updated_at: updatedAt } = payload;
      return { cert, enabled, loading: false, provider, updatedAt };
    }

    default:
      return state;
  }
};

export default accountSingleSignOnReducer;
