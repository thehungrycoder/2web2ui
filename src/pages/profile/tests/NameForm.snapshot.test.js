import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer as form } from 'redux-form';

import NameForm from '../NameForm';

const store = createStore(
  combineReducers({
    form,
    currentUser: jest.fn((state = {}) => state)
  }),
  {
    currentUser: {
      first_name: 'Ned',
      last_name: 'Stark'
    }
  }
);

let wrapper;

beforeEach(() => {
  wrapper = mount(
    <Provider store={store}>
      <NameForm />
    </Provider>
  );
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
