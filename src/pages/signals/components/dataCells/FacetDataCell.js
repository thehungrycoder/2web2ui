import React from 'react';
import PageLink from 'src/components/pageLink';
import styles from '../SpamTrapOverview.module.scss';

const FacetDataCell = ({ facet, signalOptions, subaccounts, ...props }) => {
  const id = props[facet.key];
  let search;

  if (signalOptions.subaccount) {
    search = { subaccount: signalOptions.subaccount.id };
  }

  return (
    <div className={styles.PaddedCell}>
      {facet.isDefault ? (
        subaccounts[id] ? `${subaccounts[id].name} (${id})` : id
      ) : (
        <PageLink
          children={id}
          to={{
            pathname: `/signals/spam-traps/${facet.key}/${id}`,
            search
          }}
        />
      )}
    </div>
  );
};

export default FacetDataCell;
