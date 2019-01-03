import React from 'react';

export const getColumnProps = (children) => {
  let props = [];

  React.Children.forEach(children, (child) => {
    if (child) {
      props = [...props, child.props];
    }
  });

  return props;
};

export const pickPageProps = ({ currentPage, order, perPage }) => ({ currentPage, order, perPage });
