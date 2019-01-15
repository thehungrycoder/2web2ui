import styles from './Pagination.module.scss';
import PerPageButtons from './PerPageButtons';
import React from 'react';
import SaveCSVButton from './SaveCSVButton';

export const CollectionControls = ({ data, perPage, perPageButtons, onPerPageChange, saveCsv }) => (
  <div>
    <div className={styles.PerPageButtons}>
      <PerPageButtons
        data = {data}
        perPage= {perPage}
        perPageButtons={perPageButtons}
        onPerPageChange={onPerPageChange}
      />
      <SaveCSVButton data = {data} saveCsv = {saveCsv}/>
    </div>
  </div>
);
export default CollectionControls;
