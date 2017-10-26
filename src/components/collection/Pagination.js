import React, { Component } from 'react';
import { Pagination, Button } from '@sparkpost/matchbox';
import classnames from 'classnames';
import styles from './Pagination.module.scss';

export const defaultPerPageButtons = [10, 25, 50, 100];

class CollectionPagination extends Component {

  renderPageButtons() {
    const { data, perPage, currentPage, pageRange, onPageChange } = this.props;

    if (data.length <= perPage) {
      return null;
    }

    return (
      <Pagination
        pages={Math.ceil(data.length / perPage)}
        pageRange={pageRange}
        initialIndex={(currentPage - 1)}
        onChange={onPageChange}
      />
    );
  }

  renderPerPageButtons() {
    const { data, perPage, perPageButtons, onPerPageChange } = this.props;

    if (data.length <= Math.min(...perPageButtons)) {
      return null;
    }

    return (
      <Button.Group><span style={{
        fontSize: '80%',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.5)',
        display: 'inline-block',
        marginRight: '10px'
      }}>Per Page</span>
        {perPageButtons.map((buttonAmount) => (
          <Button
            className={classnames(perPage === buttonAmount && styles.Selected)}
            key={buttonAmount}
            onClick={() => onPerPageChange(buttonAmount)}
          >{buttonAmount}</Button>
        ))}
      </Button.Group>
    );
  }

  render() {
    if (!this.props.currentPage) { return null; }

    return (
      <div>
        <div className={styles.PageButtons}>
          {this.renderPageButtons()}
        </div>
        <div className={styles.PerPageButtons}>
          {this.renderPerPageButtons()}
        </div>
      </div>
    );
  }
}

CollectionPagination.defaultProps = {
  pageRange: 5,
  perPageButtons: defaultPerPageButtons
};

export default CollectionPagination;
