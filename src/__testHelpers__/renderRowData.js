import React from 'react';
import { mount } from 'enzyme';

/**
 * Takes a list of items (usually produced by a getRowData function)
 * and mounts any react elements inside using enzyme's mount method
 *
 * @param {Array} row - list of items that may or may not be React elements
 */
export default function renderRowData(row) {
  return row.map((item) => React.isValidElement(item) ? mount(item) : item);
}
