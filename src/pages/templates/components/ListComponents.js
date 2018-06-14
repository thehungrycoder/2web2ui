import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { Popover, Button, ActionList, Tag } from '@sparkpost/matchbox';
import { ArrowDropDown } from '@sparkpost/matchbox-icons';
import styles from './ListComponents.module.scss';

const Name = ({ name, id, subaccount_id }) => (
  <Fragment>
    <p className={styles.Name}>
      <Link to={`/templates/edit/${id}${setSubaccountQuery(subaccount_id)}`}>
        <strong>{name}</strong>
      </Link>
    </p>
    <p className={styles.Id}><small><em>ID: {id}</em></small></p>
  </Fragment>
);

const Status = ({ has_published }) => {

  // Unpublished Changes
  // TODO Decide if we want to show something list page
  // if (has_published && has_draft)

  if (has_published) {
    return <Tag color='blue'>Published</Tag>;
  }

  return <Tag>Draft</Tag>;
};

const Actions = ({ id, subaccount_id, has_published }) => {
  const actions = [
    {
      content: 'Edit Draft',
      to: `/templates/edit/${id}${setSubaccountQuery(subaccount_id)}`,
      component: Link,
      section: 1
    },
    {
      content: 'Preview Draft',
      to: `/templates/preview/${id}${setSubaccountQuery(subaccount_id)}`,
      component: Link,
      section: 1
    },
    {
      content: 'View Published',
      to: `/templates/edit/${id}/published${setSubaccountQuery(subaccount_id)}`,
      component: Link,
      section: 2,
      visible: has_published
    },
    {
      content: 'Preview Published',
      to: `/templates/preview/${id}/published${setSubaccountQuery(subaccount_id)}`,
      component: Link,
      section: 2,
      visible: has_published
    }
  ];

  return (
    <div style={{ textAlign: 'right' }}>
      <Button.Group>
        <Button size='small' component={Link} to={`/templates/edit/${id}${setSubaccountQuery(subaccount_id)}`}>
          Edit
        </Button>
        <Popover left trigger={<Button size='small'><ArrowDropDown/></Button>}>
          <ActionList actions={actions}/>
        </Popover>
      </Button.Group>
    </div>
  );
};

export {
  Name,
  Status,
  Actions
};
