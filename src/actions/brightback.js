import brightbackRequest from './helpers/brightbackRequest';

export function precancel(data) {
  return brightbackRequest({
    type: 'BRIGHTBACK_PRECANCEL',
    meta: {
      method: 'POST',
      url: '/precancel',
      data
    }
  });
}
