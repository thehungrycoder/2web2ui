import React from 'react';
import SortLabel from 'src/components/collection/SortLabel'; // need to share

class HeaderLabel extends React.Component {
  handleSort = () => {
    this.props.onSort(this.nextOrder);
  }

  get nextOrder() {
    const { dataKey, order } = this.props;

    if (!order || order.dataKey !== dataKey) { // no order or order by new field
      return { ascending: true, dataKey };
    }

    if (!order.ascending) {
      return undefined; // unset
    }

    return { ascending: false, dataKey };
  }

  render() {
    const { dataKey, label, order, sortable } = this.props;
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
        onClick={this.handleSort}
      />
    );
  }
}

export default HeaderLabel;
