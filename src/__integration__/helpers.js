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

function simulateChange({ field, type, value, name }) {

  if (type === 'downshift') {
    const downshift = field.find('Downshift');
    if (!downshift.length) {
      throw new Error(`No downshift element found for ${name}`);
    }
    downshift.props().onChange(value);
    return;
  }

  let control = field.find('input');
  if (type === 'select') {
    control = field.find('select');
  }

  if (control.length === 0) {
    debugLog(field.html());
    throw new Error(`No control found in this field: ${name}`);
  }

  if (control.length > 1) {
    const controls = control.map((option) => option);
    control = controls.find((option) => option.props().value === value);
  }

  if (type === 'radio') {
    // redux form seems to be watching for currentTarget for radio buttons lol no idea why
    control.simulate('change', { currentTarget: { checked: true }});
    return;
  }

  if (type === 'checkbox') {
    control.simulate('change', { target: { checked: value }});
    return;
  }

  // text inputs and textareas should work here
  control.simulate('change', { target: { value }});
}

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

  const change = ({ type, name, value }) => {
    const field = mounted.find(`Field[name="${name}"]`);
    if (!field || field.length === 0) {
      throw new Error(`No field found for ${name}, value: ${value}`);
    }

    simulateChange({ field, type, value, name });
    mounted.update();
  };

  const toggleCheckbox = (name) => {
    let selector = `input[name="${name}"]`;
    if (typeof name === 'object') {
      const attribute = Object.keys(name)[0];
      selector = `input[${attribute}="${name[attribute]}"]`;
    }
    const checkbox = mounted.find(selector);

    if (checkbox.length !== 1) {
      throw new Error(`${selector} not found`);
    }

    const props = checkbox.props();
    if (props.type !== 'checkbox') {
      throw new Error(`${name} input is not a checkbox, instead found ${checkbox.props().type}`);
    }
    const currentlyChecked = props.checked;
    checkbox.simulate('change', { target: { checked: !currentlyChecked }});
  };

  await asyncFlush();
  mounted.update();

  return {
    mounted,
    find: mounted.find.bind(mounted),
    store,
    change,
    toggleCheckbox,
    asyncFlush,
    fill: (fields) => {
      Object.keys(fields).forEach((name) => {
        if (typeof fields[name] === 'object') {
          change({ ...fields[name], name });
        } else {
          change({ name, value: fields[name] });
        }
      });
    },
    fillInOrder: (fields) => fields.forEach(change),
    submit: async () => {
      mounted.find('form').simulate('submit');
      return asyncFlush();
    },
    /* eslint-disable-next-line no-console */
    debug: (path = 'form') => console.log(JSON.stringify(_.get(store.getState(), path), null, 2))
  };
}
