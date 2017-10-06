import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function listTrackingDomains({ force } = {}) {
  return (dispatch, getState) => {
    if (!force && getState().trackingDomains.listLoaded) {
      return;
    }

    return dispatch(
      sparkpostApiRequest({
        type: 'LIST_TRACKING_DOMAINS',
        meta: {
          method: 'GET',
          url: '/tracking-domains'
        }
      })
    );
  };
}
