import React from 'react';
import PageLink from 'src/components/pageLink';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import styles from './DataCell.module.scss';

const FacetDataCell = ({ dimension, facet, id, name, subaccountId }) => {
  let label = id;
  let search;

  if (facet === 'sid' && id === 0) {
    label = 'Master Account';
  }

  if (facet === 'sid' && id === -1) {
    return (
      <div className={styles.PaddedCell}>
        Master & All Subaccounts
      </div>
    );
  }

  if (name) {
    label = `${name} (${id})`;
  }

  if (subaccountId >= 0) {
    search = setSubaccountQuery(subaccountId);
  }

  return (
    <div className={styles.PaddedCell}>
      <PageLink
        children={label}
        to={{
          pathname: `/signals/${dimension}/${facet}/${id}`,
          search
        }}
      />
    </div>
  );
};

export default FacetDataCell;
