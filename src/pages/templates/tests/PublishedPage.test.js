import { shallow } from 'enzyme';
import React from 'react';

import PublishedPage from '../PublishedPage';

describe('Template PublishedPage', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      match: {
        params: { id: 'id' }
      },
      getPublished: jest.fn(() => Promise.resolve()),
      getTestData: jest.fn(),
      setTestData: jest.fn(() => Promise.resolve()),
      formName: 'templatePublished',
      handleSubmit: jest.fn(),
      canModify: true,
      history: { push: jest.fn() },
      getPublishedError: null,
      showAlert: jest.fn()
    };
  });

  it('should render correctly', () => {
    wrapper = shallow(<PublishedPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render read-only correctly', () => {
    wrapper = shallow(<PublishedPage {...props} canModify={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should load template content', () => {
    wrapper = shallow(<PublishedPage {...props} />);
    expect(props.getTestData).toHaveBeenCalledWith({ id: 'id', mode: 'published' });
    expect(props.getPublished).toHaveBeenCalledWith('id', props.subaccountId);
  });

  it('should redirect if template fails to load', () => {
    wrapper = shallow(<PublishedPage {...props} />);
    wrapper.setProps({ getPublishedError: 'error' });
    expect(props.history.push).toHaveBeenCalledWith('/templates/');
    expect(props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Unable to load template' });
  });

  it('should handle preview', async () => {
    wrapper = shallow(<PublishedPage {...props} />);
    await wrapper.instance().handlePreview({ testData: 'test' });
    expect(props.setTestData).toHaveBeenCalledWith({ data: 'test', id: 'id', mode: 'published' });
    expect(props.history.push).toHaveBeenCalledWith('/templates/preview/id/published');
  });

  it('should get subaccount template', () => {
    wrapper = shallow(<PublishedPage {...props} subaccountId={101} />);
    expect(props.getPublished).toHaveBeenCalledWith('id', 101);
  });

  it('should render loading', () => {
    wrapper = shallow(<PublishedPage {...props} loading />);
    expect(wrapper.find('Loading')).toHaveLength(1);
  });
});
