import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAbTest } from 'src/actions/abTesting';
import { selectAbTest, selectIdAndVersion } from 'src/selectors/abTesting';
import { selectSubaccountIdFromQuery } from 'src/selectors/subaccounts';

import { Loading } from 'src/components';
import { Delete } from '@sparkpost/matchbox-icons';
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
    showDelete: false
  }

  componentDidMount() {
    const { id, version, subaccountId, getAbTest } = this.props;
    getAbTest({ id, version, subaccountId });
  }

  componentDidUpdate({ error: prevError, location: prevLocation }) {
    const { error, test, location, id, version, subaccountId, getAbTest } = this.props;

    if (!prevError && error && _.isEmpty(test)) {
      this.setState({ shouldRedirect: true });
    }

    // For the version history selector
    // Fetch the updated version when url updates
    if (prevLocation.pathname !== location.pathname) {
      getAbTest({ id, version, subaccountId });
    }
  }

  toggleDelete = (modal) => {
    this.setState({ showDelete: !this.state.showDelete });
  }

  handleDelete = () => {
    // TODO
  }

  // Actions & other props we want to share with both Edit and View mode
  getSharedProps = () => ({
    breadcrumbAction: { content: 'Back to A/B Tests', component: Link, to: '/ab-testing' },
    deleteAction: {
      content: <span><Delete/> Delete Test</span>,
      onClick: this.toggleDelete
    },
    test: this.props.test,
    subaccountId: this.props.subaccountId
  })

  render() {
    const { loading, error, test } = this.props;
    const { status } = this.props.test;

    // Prevent children from mounting if either loading, or there is no test to render
    if (loading || (_.isEmpty(test) && !this.state.shouldRedirect)) {
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
        {/* TODO - Add delete modal here */}
      </Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    test: selectAbTest(state, props),
    loading: state.abTesting.detailsLoading,
    error: state.abTesting.detailsError,
    ...selectIdAndVersion(state, props),
    subaccountId: selectSubaccountIdFromQuery(state, props)
  };
}

export default connect(mapStateToProps, { getAbTest })(DetailsPage);
