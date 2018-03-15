import React, { Component } from 'react';
import { Pagination, Button } from '@sparkpost/matchbox';
import classnames from 'classnames';
import styles from './Pagination.module.scss';
import Papa from 'papaparse';

export const defaultPerPageButtons = [10, 25, 50, 100];

class CollectionPagination extends Component {
  formatToCsv = () => {
    const { data: rows } = this.props;
    const data = Papa.unparse(rows);
    return `data:text/csv;charset=utf-8,${encodeURI(data)}`;
  }

  renderCSVSave() {
    const { saveCsv } = this.props;

    if (!saveCsv) { return null; }

    const now = Math.floor(Date.now() / 1000);
    return <Button download={`sparkpost-csv-${now}.csv`} to={this.formatToCsv()}>Save As CSV</Button>;

  }

  renderPageButtons() {
    const { data, perPage, currentPage, pageRange, onPageChange } = this.props;

    if (data.length <= perPage) {
      return null;
    }

    return (
      <Pagination
        pages={Math.ceil(data.length / perPage)}
        pageRange={pageRange}
        currentPage={currentPage}
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
          {this.renderCSVSave()}
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
