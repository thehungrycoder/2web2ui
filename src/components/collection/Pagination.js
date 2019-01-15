import React, { Component } from 'react';
import { Pagination } from '@sparkpost/matchbox';
import styles from './Pagination.module.scss';
import CollectionControls from './CollectionControls';
import { defaultPerPageButtons } from './PerPageButtons';


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
        currentPage={currentPage}
        onChange={onPageChange}
      />
    );
  }

  render() {
    const { data, perPage, perPageButtons, onPerPageChange, saveCsv, currentPage } = this.props;
    if (!currentPage) { return null; }

    return (
      <div>
        <div className={styles.PageButtons}>
          {this.renderPageButtons()}
        </div>
        <CollectionControls
          data = {data}
          perPage= {perPage}
          perPageButtons={perPageButtons}
          onPerPageChange={onPerPageChange}
          saveCsv = {saveCsv}
        />
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
