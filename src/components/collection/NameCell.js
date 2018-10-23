import React from 'react';
import PageLink from 'src/components/pageLink';
import { slugToFriendly } from 'src/helpers/string';
import styles from './NameCell.module.scss';

const NameCell = ({
  id,
  name = slugToFriendly(id), // this default is an edge case, most resources will include a name
  to
}) => [
  <p className={styles.Name} key="name">
    <PageLink to={to}>{name}</PageLink>
  </p>,
  <p className={styles.Id} key="id">
    ID: {id}
  </p>
];

export default NameCell;
