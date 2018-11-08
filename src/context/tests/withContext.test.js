import React, { createContext } from 'react';

import withContext from '../withContext';
import { mount } from 'enzyme';

describe('withContext HoC', () => {
  let wrapper;
  const TestContext = createContext({ test: '123' });

  const Provider = ({ children }) => <TestContext.Provider value={{ test: '123' }} children={children} />;
  const TestComponent = ({ test }) => <div>{test}</div>;
  const Consumer = withContext(TestContext, TestComponent);

  it('should render with context props', () => {
    wrapper = mount(<Provider><Consumer /></Provider>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with context props and additional props', () => {
    wrapper = mount(<Provider><Consumer anotherProp={456} /></Provider>);
    expect(wrapper).toMatchSnapshot();
  });
});
