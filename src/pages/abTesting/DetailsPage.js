import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAbTest, deleteAbTest, cancelAbTest } from 'src/actions/abTesting';
import { selectAbTestFromParams, selectIdAndVersionFromParams } from 'src/selectors/abTesting';
import { selectSubaccountIdFromQuery } from 'src/selectors/subaccounts';

import { Loading, DeleteModal, ConfirmationModal } from 'src/components';
import { Delete, Cancel } from '@sparkpost/matchbox-icons';
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
    const { id, version, subaccountId, getAbTest } = this.props;
    getAbTest({ id, version, subaccountId });
  }

  componentDidUpdate({ error: prevError }) {
    const { error, test } = this.props;

    if (!prevError && error && _.isEmpty(test)) {
      this.setState({ shouldRedirect: true });
    }
  }

  toggleDelete = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  }

  handleDelete = () => {
    const { id, subaccount_id } = this.props.test;

    return this.props.deleteAbTest({ id, subaccountId: subaccount_id }).then(() => {
      this.props.showAlert({ type: 'success', message: 'Test deleted' });
      this.props.history.push('/ab-testing');
    });
  };

  toggleCancel = () => {
    this.setState({ showCancelModal: !this.state.showCancelModal });
  }

  handleCancel = () => {
    const { id, subaccount_id } = this.props.test;

    return this.props.cancelAbTest({ id, subaccountId: subaccount_id }).then(() => {
      this.props.showAlert({ type: 'success', message: 'Test cancelled' });
      this.props.history.push('/ab-testing');
    });
  };

  // Actions & other props we want to share with both Edit and View mode
  getSharedProps = () => {
    const { status } = this.props.test;
    return {
      breadcrumbAction: { content: 'Back to A/B Tests', component: Link, to: '/ab-testing' },
      cancelAction: {
        content: <span><Cancel/> Cancel Test</span>,
        visible: status === 'scheduled' || status === 'running',
        onClick: this.toggleCancel
      },
      deleteAction: {
        content: <span><Delete/> Delete Test</span>,
        visible: status === 'completed' || status === 'cancelled',
        onClick: this.toggleDelete
      },
      test: this.props.test,
      subaccountId: this.props.subaccountId
    };
  };

  render() {
    const { loading, error } = this.props;
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

    const DetailPage = (status === 'draft' || status === 'scheduled') ? EditMode : ViewMode;

    return (
      <Fragment>
        <DetailPage {...this.getSharedProps()} />
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
      </Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    test: selectAbTestFromParams(state, props),
    loading: state.abTesting.detailsLoading,
    error: state.abTesting.detailsError,
    ...selectIdAndVersionFromParams(state, props),
    subaccountId: selectSubaccountIdFromQuery(state, props)
  };
}

export default connect(mapStateToProps, { getAbTest, deleteAbTest, cancelAbTest, showAlert })(DetailsPage);
