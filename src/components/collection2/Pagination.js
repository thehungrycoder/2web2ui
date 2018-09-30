import React, { Component } from 'react';
import { Pagination, Button } from '@sparkpost/matchbox';
import SaveCsv from './SaveCsv';
import classnames from 'classnames';
import styles from './Pagination.module.scss';

export const defaultPerPageButtons = [10, 25, 50, 100];

class CollectionPagination extends Component {

  renderCSVSave() {
    if (!this.props.saveCsv) {
      return null;
    }

    return <SaveCsv rows={this.rows} />;
  }

  renderPageButtons() {
    const { rowCount, perPage, currentPage, pageRange, onPageChange } = this.props;

    if (rowCount <= perPage) {
      return null;
    }

    return (
      <Pagination
        pages={Math.ceil(rowCount / perPage)}
        pageRange={pageRange}
        currentPage={currentPage}
        onChange={onPageChange}
      />
    );
  }

  renderPerPageButtons() {
    const { rowCount, perPage, perPageButtons, onPerPageChange } = this.props;

    if (rowCount <= Math.min(...perPageButtons)) {
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
          {this.renderCSVSave()}
        </div>
      </div>
    );
  }
}

CollectionPagination.defaultProps = {
  pageRange: 5,
  perPageButtons: defaultPerPageButtons,
  saveCsv: true
};

export default CollectionPagination;
