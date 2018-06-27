import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { Popover, Button, ActionList, Tag, Tooltip } from '@sparkpost/matchbox';
import { MoreHoriz } from '@sparkpost/matchbox-icons';
import { formatDateTime } from 'src/helpers/date';
import { resolveTemplateStatus } from 'src/helpers/templates';
import styles from './ListComponents.module.scss';

const Name = ({ name, id, subaccount_id, ...rowData }) => {
  const { published } = resolveTemplateStatus(rowData);
  return (
    <Fragment>
      <p className={styles.Name}>
        <Link to={`/templates/edit/${id}${published ? '/published' : ''}${setSubaccountQuery(subaccount_id)}`}>
          <strong>{name}</strong>
        </Link>
      </p>
      <p className={styles.Id}><em>ID: {id}</em></p>
    </Fragment>
  );
};

const Status = (rowData) => {
  const { published, publishedWithChanges } = resolveTemplateStatus(rowData);

  if (published) {
    return <Tag color='blue'>Published</Tag>;
  }

  if (publishedWithChanges) {
    return <Tooltip dark content='Contains unpublished changes'><Tag color='blue'>Published &bull;</Tag></Tooltip>;
  }

  return <Tag>Draft</Tag>;
};

const Actions = ({ id, subaccount_id, ...rowData }) => {
  const { published, publishedWithChanges, draft } = resolveTemplateStatus(rowData);

  const actions = [
    {
      content: publishedWithChanges ? 'Edit Saved Draft' : 'Edit',
      to: `/templates/edit/${id}${setSubaccountQuery(subaccount_id)}`,
      component: Link
    },
    {
      // Preview Draft
      content: publishedWithChanges ? 'Preview Saved Draft' : 'Preview',
      to: `/templates/preview/${id}${setSubaccountQuery(subaccount_id)}`,
      component: Link,
      visible: publishedWithChanges || draft
    },
    {
      // Preview Published
      content: publishedWithChanges ? 'Preview Published' : 'Preview',
      to: `/templates/preview/${id}/published${setSubaccountQuery(subaccount_id)}`,
      component: Link,
      visible: publishedWithChanges || published
    }
  ];

  return (
    <div style={{ textAlign: 'right' }}>
      <Popover left trigger={<Button flat><MoreHoriz size={20}/></Button>}>
        <ActionList actions={actions}/>
      </Popover>
    </div>
  );
};

const LastUpdated = ({ last_update_time }) => <p className={styles.LastUpdated}>{formatDateTime(last_update_time)}</p>;

export {
  Name,
  Status,
  Actions,
  LastUpdated
};
