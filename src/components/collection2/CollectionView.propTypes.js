import React from 'react';
import PropTypes from 'prop-types';

function includedInRows(props, propName) {
  if (typeof props[propName] === 'undefined' ||
  Object.keys(props.rows[0]).includes(props[propName])) {
    return null;
  }
  return new Error(`${propName} must be a key included in every item in the rows array`);
}

export default {
  rows: PropTypes.arrayOf(PropTypes.object),
  rowKeyName: includedInRows,
  headerComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component)
  ]),
  rowComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component)
  ]).isRequired,
  outerWrapper: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component)
  ]),
  bodyWrapper: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component)
  ])
};
