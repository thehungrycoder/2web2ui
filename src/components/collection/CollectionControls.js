import styles from './Pagination.module.scss';
import PerPageButtons from './PerPageButtons';
import React from 'react';
import SaveCSVButton from './SaveCSVButton';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';

export const CollectionControls = ({ data, perPage, perPageButtons = DEFAULT_PER_PAGE_BUTTONS, onPerPageChange, saveCsv, totalCount }) => (
  <div>
    <div className={styles.PerPageButtons}>
      <PerPageButtons
        totalCount={totalCount || data.length}
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
