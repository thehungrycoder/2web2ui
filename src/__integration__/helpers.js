import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'src/store';
import { Provider } from 'react-redux';
import _ from 'lodash';
import debugLog from 'src/__testHelpers__/debugLog';

// prevent problems with trying to load google analytics stuff
jest.mock('src/helpers/analytics');

export const asyncFlush = () => new Promise((resolve) => setImmediate(resolve));

export const login = (store) => store.dispatch({
  type: 'LOGIN_SUCCESS',
  payload: {
    access_token: 'very-real-access-token'
  }
});

// function changeDownshift({ field, value }) {
//   const downshift = field.find('Downshift');
//   if (!downshift.length) {
//     debugLog(field.html());
//     throw new Error('No downshift element found in this field');
//   }
//   downshift.props().onChange(value);
// }

function toggleCheckbox({ mounted, name }) {
  const selector = `input[name="${name}"]`;
  let checkbox = mounted.find(selector);

  if (checkbox.length !== 1) {
    checkbox = mounted.find(name);
  }

  if (checkbox.length !== 1) {
    throw new Error(`No checkbox (${name}) found in this field`);
  }

  const props = checkbox.props();
  checkbox.simulate('change', { target: { checked: !props.checked }});
}

function selectRadioOption({ mounted, selector, value, index }) {
  const radios = mounted.find(selector);
  let control;

  if (value) {
    const options = radios.map((option) => option);
    control = options.find((option) => option.props().value === value);
  }

  if (!control && typeof index === 'number') {
    control = radios.at(index);
  }

  if (!control || control.length !== 1) {
    throw new Error(`Single radio not found for this field, instead found ${control.length} for ${value || index}`);
  }

  // redux form seems to be watching for currentTarget for radio buttons lol no idea why
  control.simulate('change', { currentTarget: { checked: true }});
}

export async function setupForm(tree) {
  const store = configureStore();
  login(store);
  setReady(store);

  const mounted = mount(
    <Provider store={store}>
      <MemoryRouter>
        {tree}
      </MemoryRouter>
    </Provider>
  );

  function fill(selector, value) {
    const control = mounted.find(selector);
    if (control.length !== 1) {
      debugLog(mounted.html());
      throw new Error('No control found in this field');
    }
    control.simulate('change', { target: { value }});
    control.simulate('change', value); // for downshift, etc.
    mounted.update();
  }

  await asyncFlush();
  mounted.update();

  return {
    mounted,
    find: mounted.find.bind(mounted),
    store,
    fill,
    toggleCheckbox: (name) => {
      toggleCheckbox({ mounted, name });
      mounted.update();
    },
    selectRadioOption: (options) => {
      selectRadioOption({ mounted, ...options });
      mounted.update();
    },
    asyncFlush,
    submit: async () => {
      mounted.find('form').simulate('submit');
      return asyncFlush();
    },
    /* eslint-disable-next-line no-console */
    debug: (path = 'form') => console.log(JSON.stringify(_.get(store.getState(), path), null, 2))
  };
}
