import React from 'react';
import { mount, shallow } from 'enzyme';
import { reduxForm, Field } from 'redux-form';
import { MemoryRouter, Link } from 'react-router-dom';

const MockForm = reduxForm({ form: 'MockForm' })(({ children }) => <form>{children}</form>);

function tryMount(item) {
  let result = 'UNRENDERABLE';
  try {
    result = mount(item);
  } catch (err) {
    result = tryShallow(item);
  }
  return result;
}

function tryShallow(item) {
  let result = 'UNRENDERABLE';
  try {
    result = shallow(item);
  } catch (err) {
    if (err.message === 'Field must be inside a component decorated with reduxForm()') {
      result = shallow(<MockForm>{item}</MockForm>).find(Field);
    } else if (err.message === 'You should not use <Link> outside a <Router>') {
      result = shallow(<MemoryRouter keyLength={0}>{item}</MemoryRouter>).find(Link);
    } else {
      // eslint-disable-next-line no-console
      console.log('\n===\n\n UNKNOWN RENDER ROW DATA ERROR\n', err.message, '\n\n===');
    }
  }

  return result;
}

/**
 * Takes a list of items (usually produced by a getRowData function)
 * and mounts any react elements inside using enzyme's mount method
 *
 * @param {Array} row - list of items that may or may not be React elements
 */
export default function renderRowData(row) {
  return row.map((item) => React.isValidElement(item) ? tryMount(item) : item);
}
