import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

// Actions
import { listAbTests, deleteAbTest, cancelAbTest } from 'src/actions/abTesting';
import { showAlert } from 'src/actions/globalAlert';

// Components
import { Page, UnstyledLink, Button, Popover, ActionList } from '@sparkpost/matchbox';
import { Loading, TableCollection, ApiErrorBanner, DeleteModal, ConfirmationModal } from 'src/components';
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

  state = {
    showDeleteModal: false,
    testToDelete: {},
    testToCancel: {}
  };

  componentDidMount() {
    this.props.listAbTests();
  }

  getDetailsLink = ({ id, version, subaccount_id }) => `/ab-testing/${id}/${version}${setSubaccountQuery(subaccount_id)}`

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

  getRowData = ({ id, version, subaccount_id, name, status, updated_at, default_template, winning_template_id }) => {
    const actions = [
      {
        content: 'Edit Test',
        to: this.getDetailsLink({ id, version, subaccount_id }),
        component: Link,
        visible: status === 'scheduled' || status === 'draft',
        section: 1
      },
      {
        content: 'View Test',
        to: this.getDetailsLink({ id, version, subaccount_id }),
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
        visible: status === 'scheduled' || status === 'running',
        section: 2,
        onClick: () => this.toggleCancel(id, subaccount_id)
      },
      {
        content: 'Delete Test',
        visible: status === 'completed' || status === 'cancelled',
        section: 2,
        onClick: () => this.toggleDelete(id, subaccount_id)
      }
    ];

    const template = winning_template_id
      ? <Fragment><span className={styles.Winner}>Winner:</span> {winning_template_id}</Fragment>
      : default_template.template_id;

    return [
      <Fragment>
        <p className={styles.Name}>
          <strong><UnstyledLink to={this.getDetailsLink({ id, version, subaccount_id })} component={Link}>{name}</UnstyledLink></strong>
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

  toggleDelete = (id, subaccount_id) => {
    this.setState({
      showDeleteModal: !this.state.showDeleteModal,
      testToDelete: { id, subaccountId: subaccount_id }
    });
  };

  handleDelete = () => {
    const { id, subaccountId } = this.state.testToDelete;

    return this.props.deleteAbTest({ id, subaccountId }).then(() => {
      this.props.showAlert({ type: 'success', message: 'Test deleted' });
      this.toggleDelete();
    });
  };

  toggleCancel = (id, subaccount_id) => {
    this.setState({
      showCancelModal: !this.state.showCancelModal,
      testToCancel: { id, subaccountId: subaccount_id }
    });
  };

  handleCancel = () => {
    const { id, subaccountId } = this.state.testToCancel;

    return this.props.cancelAbTest({ id, subaccountId }).then(() => {
      this.props.showAlert({ type: 'success', message: 'Test cancelled' });
      this.toggleCancel();
    });
  };

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
        <DeleteModal
          open={this.state.showDeleteModal}
          title='Are you sure you want to delete this test?'
          content={<p>The test and all associated versions will be immediately and permanently removed. This cannot be undone.</p>}
          onDelete={this.handleDelete}
          onCancel={this.toggleDelete}
        />
        <ConfirmationModal
          open={this.state.showCancelModal}
          title='Are you sure you want to cancel this test?'
          content={<p>The test will be cancelled and all further messages will be delivered to the default template.</p>}
          onConfirm={this.handleCancel}
          onCancel={this.toggleCancel}
          confirmVerb='OK'
        />
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

export default connect(mapStateToProps, { listAbTests, deleteAbTest, cancelAbTest, showAlert })(ListPage);
