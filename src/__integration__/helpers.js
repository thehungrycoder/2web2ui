import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'src/store';
import { Provider } from 'react-redux';
import _ from 'lodash';

// prevent problems with trying to load google analytics stuff
jest.mock('src/helpers/analytics');

export const asyncFlush = () => new Promise((resolve) => setImmediate(resolve));

export const login = (store) => store.dispatch({
  type: 'LOGIN_SUCCESS',
  payload: {
    access_token: 'very-real-access-token'
  }
});

export async function setupForm(tree) {
  const store = configureStore();
  login(store);

  const mounted = mount(
    <Provider store={store}>
      <MemoryRouter>
        {tree}
      </MemoryRouter>
    </Provider>
  );

  const change = (index, value) => {
    const el = mounted.find('Field').at(index);

    const downshift = el.find('Downshift');
    if (downshift.length) {
      downshift.props().onChange(value);
    } else {
      let control = el.find('input');
      if (control.length === 0) {
        control = el.find('select');
      }
      control.simulate('change', { target: { value }});
    }

    mounted.update();
  };

  await asyncFlush();
  mounted.update();

  return {
    mounted,
    find: mounted.find.bind(mounted),
    store,
    change,
    asyncFlush,
    fill: (fields) => fields.map((val, i) => change(i, val)),
    submit: async () => {
      mounted.find('form').simulate('submit');
      return asyncFlush();
    },
    /* eslint-disable-next-line no-console */
    debug: (path = 'form') => console.log(JSON.stringify(_.get(store.getState(), path), null, 2))
  };
}
