// import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function precancel(data) {
  console.log({ data })
  return {
    type: 'BRIGHTBACK_PRECANCEL_TEST'
  }
  // return brightbackRequest({
  //   type: 'BRIGHTBACK_PRECANCEL',
  //   meta: {
  //     method: 'POST',
  //     url: '/precancel'
  //   }
  // });
}
