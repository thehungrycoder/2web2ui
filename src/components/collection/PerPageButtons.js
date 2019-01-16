import { Button } from '@sparkpost/matchbox';
import classnames from 'classnames';
import styles from './Pagination.module.scss';
import React from 'react';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';


const PerPageButtons = ({ data, perPage, perPageButtons = DEFAULT_PER_PAGE_BUTTONS, onPerPageChange }) => {

  //Keep this '<' and not '<=' because cursor paging will always have data.length = perPage
  if (data.length < Math.min(...perPageButtons)) {
    return null;
  }

  return (
    <Button.Group><span className={styles.PerPageText}>Per Page</span>
      {perPageButtons.map((buttonAmount) => (
        <Button
          className={classnames(perPage === buttonAmount && styles.Selected)}
          key={buttonAmount}
          onClick={() => onPerPageChange(buttonAmount)}
        >{buttonAmount}</Button>
      ))}
    </Button.Group>
  );
};

export default PerPageButtons;
