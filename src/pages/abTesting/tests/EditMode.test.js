import { shallow } from 'enzyme';
import React from 'react';
import { EditMode } from '../EditMode';
import { formatFormValues } from 'src/helpers/abTesting';

jest.mock('src/helpers/abTesting');

describe('Page: A/B Test Edit Mode', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      subaccountId: '101',
      test: {
        id: 'id-1',
        version: '1',
        name: 'my ab test 1',
        status: 'draft',
        default_template: {
          template_id: 'ab-test-1'
        },
        updated_at: '2018-10-21T10:10:10.000Z'
      },
      getAbTest: jest.fn(),
      showAlert: jest.fn(),
      updateDraft: jest.fn(() => Promise.resolve()),
      deleteAction: {
        content: 'delete test',
        onClick: jest.fn()
      },
      cancelAction: {
        content: 'cancel test',
        onClick: jest.fn()
      },
      handleSubmit: jest.fn((a) => a),
      formValues: 'test values',
      submitting: false
    };
    wrapper = shallow(<EditMode {...props} />);
    formatFormValues.mockImplementation((a) => a);
  });

  it('should render draft status correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render scheduled status correctly', () => {
    wrapper.setProps({ test: { ...props.test, status: 'scheduled' }});
    expect(wrapper).toMatchSnapshot();
  });

  describe('draft actions', () => {
    it('should call save as draft method from secondary action', () => {
      wrapper.find('Page').prop('secondaryActions')[0].onClick();
      expect(props.handleSubmit).toHaveBeenCalledWith(wrapper.instance().handleSaveAsDraft);
    });

    it('should call handle save as draft', async () => {
      await wrapper.instance().handleSaveAsDraft(props.formValues);
      expect(props.updateDraft).toHaveBeenCalledWith(props.formValues, { id: props.test.id, subaccountId: props.subaccountId });
      expect(props.getAbTest).toHaveBeenCalledWith({ id: props.test.id, version: props.test.version, subaccountId: props.subaccountId });
      expect(props.showAlert).toHaveBeenCalledWith({ message: 'A/B Test Draft Updated', type: 'success' });
    });
  });
});
