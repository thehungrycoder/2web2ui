import React from 'react';
import { CreatePage as TrackingDomainsCreatePage } from '../CreatePage';
import { shallow } from 'enzyme';

describe('Component: Tracking Domains Create Page', () => {

  expect.hasAssertions();

  it('should handle the submit', () => {
    const historyMock = {
      push: jest.fn()
    };
    const showAlertMock = jest.fn()
    const createTrackingDomainMock = jest.fn(() => Promise.resolve());
    const data = {};
    const instance = shallow(<TrackingDomainsCreatePage
      history={historyMock}
      showAlert={showAlertMock}
      createTrackingDomain={createTrackingDomainMock}
    />).instance();

    return instance.onSubmit(data).then(() => {
      expect(createTrackingDomainMock).toHaveBeenCalledWith(data);
      expect(historyMock.push).toHaveBeenCalledWith('/account/tracking-domains');
    });
  });

});
