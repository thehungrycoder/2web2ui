import React from 'react';
import { Brightback } from '../Brightback';
import { shallow } from 'enzyme';

describe('Brightback Component', () => {
  const props = {
    render: jest.fn(({ buttonProps }) => (
      <button type='submit' {...buttonProps}>test</button>
    )),
    enabled: true,
    hasBrightbackOption: true,
    precancel: jest.fn(),
    data: {
      test: 'data'
    },
    valid: true,
    url: 'http://redirect-to-brightback.com'
  };

  it('should render correctly when enabled and with valid account data', () => {
    const wrapper = shallow(<Brightback {...props}/>);
    expect(wrapper).toMatchSnapshot();
    expect(props.precancel).toHaveBeenCalledWith(props.data);
  });

  it('should render fallback without the UI option', () => {
    const wrapper = shallow(<Brightback {...props} hasBrightbackOption={false} />);
    expect(wrapper).toMatchSnapshot();
    expect(props.precancel).not.toHaveBeenCalled();
  });

  it('should render fallback without valid account data', () => {
    const wrapper = shallow(<Brightback {...props} valid={false} />);
    expect(wrapper).toMatchSnapshot();
    expect(props.precancel).toHaveBeenCalledWith(props.data);
  });

  it('should render fallback when not enabled', () => {
    const wrapper = shallow(<Brightback {...props} enabled={false} />);
    expect(wrapper).toMatchSnapshot();
    expect(props.precancel).toHaveBeenCalledWith(props.data);
  });
});
