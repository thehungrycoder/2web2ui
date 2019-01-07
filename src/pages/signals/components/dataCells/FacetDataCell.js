import React from 'react';
import PageLink from 'src/components/pageLink';
import styles from './DataCell.module.scss';

const FacetDataCell = ({ facet, id, name, signalOptions }) => {
  let label = id;
  let search;

  if (facet === 'sid' && id === 0) {
    label = 'Master Account';
  }

  if (name) {
    label = `${name} (${id})`;
  }

  if (signalOptions.subaccount) {
    search = { subaccount: signalOptions.subaccount.id };
  }

  return (
    <div className={styles.PaddedCell}>
      <PageLink
        children={label}
        to={{
          pathname: `/signals/spam-traps/${facet}/${id}`,
          search
        }}
      />
    </div>
  );
};

export default FacetDataCell;
