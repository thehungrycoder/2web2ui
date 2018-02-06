import React from 'react';
import { mount, shallow } from 'enzyme';
import { reduxForm, Field } from 'redux-form';
import { MemoryRouter, Link } from 'react-router-dom';

const MockForm = reduxForm({ form: 'MockForm' })(({ children }) => <form>{children}</form>);

export const renderReduxFormField = (field) => shallow(<MockForm>{field}</MockForm>).find(Field);
export const renderReactRouterLink = (link) => shallow(<MemoryRouter>{link}</MemoryRouter>).find(Link);

export function tryMount(item) {
  let result = 'UNRENDERABLE';
  try {
    result = mount(item);
  } catch (err) {
    result = tryShallow(item);
  }
  return result;
}

export function tryShallow(item) {
  let result = 'UNRENDERABLE';
  try {
    result = shallow(item);
  } catch (err) {
    if (err.message === 'Field must be inside a component decorated with reduxForm()') {
      result = renderReduxFormField(item);
    } else if (err.message === 'You should not use <Link> outside a <Router>') {
      result = renderReactRouterLink(item);
    } else {
      result = item;
    }
  }

  return result;
}

/**
 * Takes a list of items (usually produced by a getRowData function)
 * and attempts to shallow render any react elements with the right context
 *
 * @param {Array} row - list of items that may or may not be React elements
 */
export function renderRowData(row) {
  return row.map((item) => React.isValidElement(item) ? tryShallow(item) : item);
}
