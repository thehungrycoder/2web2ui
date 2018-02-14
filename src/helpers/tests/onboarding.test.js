import * as onboarding from '../onboarding';

describe('Onboarding helpers', () => {
  it('Should get correct transmission uri', () => {
    expect(onboarding.getTransmissionsUri()).toEqual('http://fake-api-test-host.com/api/v1/transmissions');
  });

  it('Should create a curl request', () => {
    expect(onboarding.curlRequest({ apiKey: '12345', email: 'test@test.com' })).toMatchSnapshot();
  });
});
