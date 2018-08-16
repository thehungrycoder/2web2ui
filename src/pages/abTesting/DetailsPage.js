import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAbTest, getLatestAbTest, deleteAbTest, cancelAbTest } from 'src/actions/abTesting';
import { selectAbTestFromParams, selectIdAndVersionFromParams } from 'src/selectors/abTesting';
import { selectSubaccountIdFromQuery } from 'src/selectors/subaccounts';

import { Loading, DeleteModal, ConfirmationModal } from 'src/components';
import { Delete, Block } from '@sparkpost/matchbox-icons';
import { showAlert } from 'src/actions/globalAlert';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import EditMode from './EditMode';
import ViewMode from './ViewMode';
import _ from 'lodash';

/**
 * Details Page
 * - Handles GET
 * - Determines which page to render via test status
 * - Constructs shared actions between editing/non-editing modes
 */
export class DetailsPage extends Component {
  static defaultProps = {
    test: {}
  }

  state = {
    shouldRedirect: false,
    showDeleteModal: false,
    showCancelModal: false
  }

  componentDidMount() {
    const { id, version, subaccountId, getAbTest, getLatestAbTest } = this.props;

    getAbTest({ id, version, subaccountId });
    getLatestAbTest({ id, subaccountId });
  }

  componentDidUpdate({ error: prevError, version: prevVersion }) {
    const { error, test, getAbTest, getLatestAbTest, id, version, subaccountId } = this.props;

    if (!prevError && error && _.isEmpty(test)) {
      this.setState({ shouldRedirect: true });
    }

    // Version history selector - Fetch the test when url updates
    if (prevVersion !== version) {
      getAbTest({ id, version, subaccountId });
      getLatestAbTest({ id, subaccountId });
    }
  }

  toggleDelete = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  }

  handleDelete = () => {
    const { id } = this.props.test;
    const { subaccountId, deleteAbTest, showAlert, history } = this.props;

    return deleteAbTest({ id, subaccountId }).then(() => {
      showAlert({ type: 'success', message: 'Test deleted' });
      history.push('/ab-testing');
    });
  };

  toggleCancel = () => {
    this.setState({ showCancelModal: !this.state.showCancelModal });
  }

  handleCancel = () => {
    const { id } = this.props.test;
    const { subaccountId, version, cancelAbTest, getAbTest, showAlert } = this.props;

    return cancelAbTest({ id, subaccountId }).then(() => {
      showAlert({ type: 'success', message: 'Test cancelled' });
      getAbTest({ id, version, subaccountId });
      this.toggleCancel();
    });
  };

  // Actions & other props we want to share with both Edit and View mode
  getSharedProps = () => {
    const { status } = this.props.test;
    const { test, subaccountId, rescheduling } = this.props;

    return {
      breadcrumbAction: { content: 'Back to A/B Tests', component: Link, to: '/ab-testing' },
      cancelAction: {
        content: <span><Block/> Cancel Test</span>,
        visible: status === 'scheduled' || status === 'running',
        onClick: this.toggleCancel
      },
      deleteAction: {
        content: <span><Delete/> Delete Test</span>,
        onClick: this.toggleDelete
      },
      test,
      subaccountId,
      rescheduling
    };
  };

  render() {
    const { loading, error, rescheduling } = this.props;
    const { status } = this.props.test;

    if (loading) {
      return <Loading />;
    }

    if (this.state.shouldRedirect) {
      return (
        <RedirectAndAlert
          to='/ab-testing'
          alert={{ type: 'warning', message: 'Unable to load A/B test', details: _.get(error, 'message') }}
        />
      );
    }

    const DetailPage = (status === 'draft' || status === 'scheduled' || rescheduling) ? EditMode : ViewMode;

    return (
      <Fragment>
        <DetailPage {...this.getSharedProps()} />
        <DeleteModal
          open={this.state.showDeleteModal}
          title='Are you sure you want to delete this test?'
          content={<p>The test and all associated versions will be immediately and permanently removed. This cannot be undone.</p>}
          onDelete={this.handleDelete}
          onCancel={this.toggleDelete}
          isPending={this.props.deletePending}
        />
        <ConfirmationModal
          open={this.state.showCancelModal}
          title='Are you sure you want to cancel this test?'
          content={<p>The test will be cancelled and all further messages will be delivered to the default template.</p>}
          onConfirm={this.handleCancel}
          onCancel={this.toggleCancel}
          isPending={this.props.cancelPending}
          confirmVerb='OK'
        />
      </Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    test: selectAbTestFromParams(state, props),
    loading: state.abTesting.detailsLoading,
    deletePending: state.abTesting.deletePending,
    cancelPending: state.abTesting.cancelPending,
    error: state.abTesting.detailsError,
    ...selectIdAndVersionFromParams(state, props),
    subaccountId: selectSubaccountIdFromQuery(state, props),
    rescheduling: _.get(props, 'location.state.rescheduling')
  };
}

export default connect(mapStateToProps, { getAbTest, getLatestAbTest, deleteAbTest, cancelAbTest, showAlert })(DetailsPage);
