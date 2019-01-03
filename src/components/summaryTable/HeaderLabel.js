import React from 'react';
import SortLabel from 'src/components/collection/SortLabel'; // need to share

const HeaderLabel = ({ dataKey, label, onSort, order, sortable }) => {
  let direction;

  if (!sortable) {
    return label;
  }

  if (order && order.dataKey === dataKey) {
    direction = order.ascending ? 'asc' : 'desc';
  }

  return (
    <SortLabel
      direction={direction}
      label={label}
      onClick={() => onSort({ ascending: !direction || direction === 'desc', dataKey })}
    />
  );
};

export default HeaderLabel;
