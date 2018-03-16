import React, { Component } from 'react';
import { Pagination, Button } from '@sparkpost/matchbox';
import classnames from 'classnames';
import styles from './Pagination.module.scss';
import Papa from 'papaparse';
import _ from 'lodash';

export const defaultPerPageButtons = [10, 25, 50, 100];

class CollectionPagination extends Component {
  formatToCsv = () => {
    const { data: rows } = this.props;
    // we are doing this because certain keys are objects/array which papa parse doesn't stringify
    const mappedRows = _.map(rows, (row) => _.mapValues(row, (value) => _.isObject(value) || _.isArray(value) ? JSON.stringify(value) : value));
    const data = Papa.unparse(mappedRows);
    return `data:text/csv;charset=utf-8,${encodeURI(data)}`;
  }

  renderCSVSave() {
    const { saveCsv, data, perPageButtons } = this.props;

    // do not show save as csv if only 1 page of smallest per page increment
    if (!saveCsv || data.length <= Math.min(...perPageButtons)) { return null; }

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
  perPageButtons: defaultPerPageButtons,
  saveCsv: true
};

export default CollectionPagination;
