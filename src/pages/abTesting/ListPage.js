import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Actions
import { listAbTests } from 'src/actions/abTesting';

// Components
import { Page, UnstyledLink, Button, Popover, ActionList } from '@sparkpost/matchbox';
import { Loading, TableCollection, ApiErrorBanner } from 'src/components';
import { MoreHoriz } from '@sparkpost/matchbox-icons';
import { Setup } from 'src/components/images';
import StatusTag from './components/StatusTag';
import { formatDateTime } from 'src/helpers/date';

import styles from './ListPage.module.scss';

const filterBoxConfig = {
  show: true,
  itemToStringKeys: ['name', 'id', 'status', 'test_mode'],
  exampleModifiers: ['id', 'status', 'test_mode']
};

export class ListPage extends Component {

  componentDidMount() {
    this.props.listAbTests();
  }

  getColumns() {
    const columns = [
      { label: 'Name', sortKey: 'name' },
      { label: 'Status', sortKey: 'status' },
      { label: 'Template', sortKey: (i) => i.winning_template_id || i.default_template.template_id },
      { label: 'Last Modified', sortKey: 'updated_at' },
      null
    ];

    return columns;
  }

  getRowData({ id, version, name, status, updated_at, default_template, winning_template_id }) {
    const actions = [
      {
        content: 'Edit Test',
        to: `/ab-testing/${id}/${version}`,
        component: Link,
        visible: status === 'scheduled' || status === 'draft',
        section: 1
      },
      {
        content: 'View Test',
        to: `/ab-testing/${id}/${version}`,
        component: Link,
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
      ? <Fragment><span className={styles.Winner}>Winner:</span> {winning_template_id}</Fragment>
      : default_template.template_id;

    return [
      <Fragment>
        <p className={styles.Name}>
          <strong><UnstyledLink to={`/ab-testing/${id}/${version}`} component={Link}>{name}</UnstyledLink></strong>
        </p>
        <p className={styles.Id}>ID: {id}</p>
      </Fragment>,
      <StatusTag status={status}/>,
      <p className={styles.Template}>{template}</p>,
      <p className={styles.LastUpdated}>{formatDateTime(updated_at)}</p>,
      <div style={{ textAlign: 'right' }}>
        <Popover left trigger={<Button flat size='large'><MoreHoriz size={21}/></Button>}>
          <ActionList actions={actions}/>
        </Popover>
      </div>
    ];
  }

  renderError() {
    const { error, listAbTests } = this.props;
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your A/B tests.'}
        errorDetails={error.message}
        reload={listAbTests}
      />
    );
  }

  renderCollection() {
    const { abTests } = this.props;
    return (
      <TableCollection
        columns={this.getColumns()}
        rows={abTests}
        getRowData={this.getRowData}
        pagination={true}
        filterBox={filterBoxConfig}
        defaultSortColumn='updated_at'
        defaultSortDirection='desc'
      />
    );
  }

  render() {
    const { loading, error, abTests } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title='A/B Testing'
        primaryAction={{ content: 'Create a New A/B Test', to: '/ab-testing/create', component: Link }}
        empty={{
          show: !error && abTests.length === 0,
          image: Setup,
          title: 'Create an A/B test',
          content: <p>Create and run A/B tests to boost your engagement.</p>
        }}>
        {error ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }
}

function mapStateToProps({ abTesting, ...state }) {
  return {
    abTests: abTesting.list,
    loading: abTesting.listLoading,
    error: abTesting.listError
  };
}

export default connect(mapStateToProps, { listAbTests })(ListPage);
