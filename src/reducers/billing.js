import { formatCountries } from 'src/helpers/billing';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PLANS_PENDING':
      return { ...state, plansLoading: true };

    case 'GET_PLANS_SUCCESS':
      return { ...state, plans: action.payload, plansLoading: false };

    case 'GET_PLANS_ERROR':
      return { ...state, plansLoading: false };

    case 'GET_COUNTRIES_BILLING_PENDING':
      return { ...state, countriesLoading: true };

    case 'GET_COUNTRIES_BILLING_SUCCESS':
      return {
        ...state,
        countriesLoading: false,
        countries: formatCountries(action.payload)
      };

    case 'GET_COUNTRIES_BILLING_ERROR':
      return { ...state, countriesLoading: false };

    default:
      return state;
  }
};
