import React from 'react';
import { shallow } from 'enzyme';
import { TrackingDomainRow, IsDefaultTag, SubaccountTag } from '../TrackingDomainRow';

/**
 * Returns whether a given shallow render wrapper
 * contains the Delete button or not by checking props
 * on all Button components found
 *
 * @param {Enzyme shallow render} wrapper
 * @return {Boolean}
 */
function deleteButtonPresent(wrapper) {
  const instance = wrapper.instance();
  return wrapper.find('Button').someWhere((button) => {
    const { destructive, onClick } = button.props();
    return destructive && onClick === instance.toggleDeleteModal;
  });
}

describe('Component: TrackingDomainRow', () => {

  it('should toggle the delete modal', () => {
    const wrapper = shallow(<TrackingDomainRow verifying={[]} />);
    const instance = wrapper.instance();
    expect(wrapper.state().deleteModalOpen).toEqual(false);
    instance.toggleDeleteModal();
    expect(wrapper.state().deleteModalOpen).toEqual(true);
    instance.toggleDeleteModal();
    expect(wrapper.state().deleteModalOpen).toEqual(false);
  });

  it('should toggle the default modal', () => {
    const wrapper = shallow(<TrackingDomainRow verifying={[]} />);
    const instance = wrapper.instance();
    expect(wrapper.state().defaultModalOpen).toEqual(false);
    instance.toggleDefaultModal();
    expect(wrapper.state().defaultModalOpen).toEqual(true);
    instance.toggleDefaultModal();
    expect(wrapper.state().defaultModalOpen).toEqual(false);
  });

  it('should handle deletion', () => {
    const deleteMock = jest.fn();
    const wrapper = shallow(<TrackingDomainRow
      verifying={[]}
      deleteTrackingDomain={deleteMock}
      domain='deleteme.com'
      subaccountId={100}
    />);
    const instance = wrapper.instance();
    jest.spyOn(instance, 'toggleDeleteModal');
    instance.handleDelete();
    expect(deleteMock).toHaveBeenCalledWith({ domain: 'deleteme.com', subaccountId: 100 });
    expect(instance.toggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  it('should re-verify a domain', () => {
    const verifyMock = jest.fn();
    const wrapper = shallow(<TrackingDomainRow
      verifying={[]}
      verifyTrackingDomain={verifyMock}
      domain='verifyme.com'
      subaccountId={200}
    />);
    wrapper.instance().retryVerification();
    expect(verifyMock).toHaveBeenCalledWith({ domain: 'verifyme.com', subaccountId: 200 });
  });

  describe('Tag components', () => {

    it('should render the IsDefaultTag', () => {
      expect(shallow(<IsDefaultTag />)).toMatchSnapshot();
    });

    it('should render the IsDefaultTag when assigned to a subaccount', () => {
      expect(shallow(<IsDefaultTag assignedToSubaccount />)).toMatchSnapshot();
    })

    it('should render the SubaccountTag', () => {
      expect(shallow(<SubaccountTag id={213} />)).toMatchSnapshot();
    });

  });

  describe('rendering when assigned to master account', () => {

    it('should render a non-default unverified domain', () => {
      const wrapper = shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        status='unverified'
        isDefault={false}
      />);
      expect(wrapper).toMatchSnapshot();
      expect(deleteButtonPresent(wrapper)).toEqual(true);
    });

    it('should render a default unverified domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        status='unverified'
        isDefault={true}
      />)).toMatchSnapshot();
    });

    it('should render a pending domain', () => {
      const wrapper = shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        status='pending'
        isDefault={false}
      />);
      expect(wrapper).toMatchSnapshot();
      expect(deleteButtonPresent(wrapper)).toEqual(false);
    });

    it('should render a blocked domain', () => {
      const wrapper = shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        status='blocked'
        isDefault={false}
      />);
      expect(wrapper).toMatchSnapshot();
      expect(deleteButtonPresent(wrapper)).toEqual(false);
    });

    it('should render a non-default verified domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        verified={true}
        status='verified'
        isDefault={false}
      />)).toMatchSnapshot();
    });

    it('should render a default verified domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        verified={true}
        status='verified'
        isDefault={true}
      />)).toMatchSnapshot();
    });

    it('should render a "currently verifying" domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={['somedomain.com']}
        status='unverified'
        isDefault={false}
      />)).toMatchSnapshot();
    });

  });

  describe('rendering when assigned to subaccount', () => {

    it('should render a non-default unverified domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        status='unverified'
        isDefault={false}
        subaccountId={100}
      />)).toMatchSnapshot();
    });

    it('should render a default unverified domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        status='unverified'
        isDefault={true}
        subaccountId={100}
      />)).toMatchSnapshot();
    });

    it('should render a pending domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        status='pending'
        isDefault={false}
        subaccountId={100}
      />)).toMatchSnapshot();
    });

    it('should render a blocked domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        status='blocked'
        isDefault={false}
        subaccountId={100}
      />)).toMatchSnapshot();
    });

    it('should render a non-default verified domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        verified={true}
        status='verified'
        isDefault={false}
        subaccountId={100}
      />)).toMatchSnapshot();
    });

    it('should render a default verified domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={[]}
        verified={true}
        status='verified'
        isDefault={true}
        subaccountId={100}
      />)).toMatchSnapshot();
    });

    it('should render a "currently verifying" domain', () => {
      expect(shallow(<TrackingDomainRow
        domain='somedomain.com'
        verifying={['somedomain.com']}
        status='unverified'
        isDefault={false}
        subaccountId={100}
      />)).toMatchSnapshot();
    });

  });

});
