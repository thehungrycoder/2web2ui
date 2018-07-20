import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { TableCollection } from 'src/components';
import { Page, UnstyledLink, Button, Popover, ActionList } from '@sparkpost/matchbox';
import { MoreHoriz } from '@sparkpost/matchbox-icons';
import StatusTag from './components/StatusTag';
import { formatDate } from 'src/helpers/date';

import data from './data'; // fake data

import styles from './ListPage.module.scss';

class ListPage extends Component {

  getRowData = ({ id, name, status, updated_at, version, default_template, winning_template_id }) => {

    const actions = [
      {
        content: 'Edit Test',
        to: `/ab-testing/${id}`,
        component: Link,
        visible: status === 'scheduled' || status === 'draft',
        section: 1
      },
      {
        content: 'View Test',
        visible: status === 'running' || status === 'cancelled' || status === 'completed',
        section: 1
      },
      {
        content: 'Edit and Rerun Test',
        visible: status === 'completed' || status === 'cancelled',
        section: 1
      },
      {
        content: 'Cancel Test',
        visible: status === 'running',
        section: 2
      },
      {
        content: 'Delete Test',
        section: 2
      }
    ];

    const template = winning_template_id
      ? <React.Fragment><span className={styles.Winner}>Winner:</span> {winning_template_id}</React.Fragment>
      : default_template.template_id;

    return [
      <React.Fragment>
        <p className={styles.Name}>
          <strong><UnstyledLink to={`/ab-testing/${id}`} component={Link}>{name}</UnstyledLink></strong>
        </p>
        <p className={styles.Id}>ID: {id}</p>
      </React.Fragment>,
      <StatusTag status={status}/>,
      <p className={styles.Template}>{template}</p>,
      <p className={styles.LastUpdated}>{formatDate(updated_at)}</p>,
      <div style={{ textAlign: 'right' }}>
        <Popover left trigger={<Button flat size='large'><MoreHoriz size={21}/></Button>}>
          <ActionList actions={actions}/>
        </Popover>
      </div>
    ];
  }

  render() {
    const columns = [
      { label: 'Name', sortKey: 'name' },
      { label: 'Status', sortKey: 'status' },
      { label: 'Template', sortKey: (i) => i.winning_template_id || i.default_template.template_id },
      { label: 'Last Modified', sortKey: 'updated_at' },
      null
    ];

    return (
      <Page
        title='A/B Testing'
        primaryAction={{ content: 'Create a New A/B Test', to: '/ab-testing/create', component: Link }} >

        <TableCollection
          columns={columns}
          rows={data}
          getRowData={this.getRowData}
          pagination
          filterBox={{
            show: true,
            itemToStringKeys: ['name', 'id', 'status', 'test_mode'],
            exampleModifiers: ['id', 'status', 'test_mode']
          }}
          defaultSortColumn='updated_at'
        />

      </Page>

    );
  }
}

export default ListPage;
