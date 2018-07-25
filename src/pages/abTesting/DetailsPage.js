import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAbTest } from 'src/actions/abTesting';
import { selectAbTest, selectIdAndVersion } from 'src/selectors/abTesting';

import { Loading } from 'src/components';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { Page, UnstyledLink, Button, Popover, ActionList } from '@sparkpost/matchbox';
import { Save, Delete } from '@sparkpost/matchbox-icons';
import _ from 'lodash';

export class DetailsPage extends Component {
  static defaultProps = {
    test: {}
  }

  state = {
    shouldRedirect: false
  }

  componentDidMount() {
    const { id, version, getAbTest } = this.props;
    getAbTest({ id, version });
  }

  componentDidUpdate({ error: prevError }) {
    const { error, test } = this.props;

    if (!prevError && error && _.isEmpty(test)) {
      this.setState({ shouldRedirect: true });
    }
  }

  getPrimaryAction = () => {
    const { status } = this.props.test;

    if (status === 'draft') {
      return {
        content: 'Finalize and Schedule Test'
      };
      // action.onClick = () => ()
    }

    if (status === 'scheduled') {
      return {
        content: 'Update Test'
      };
    }

    if (status === 'cancelled' || status === 'completed') {
      return {
        content: 'Edit and Rerun Test',
        component: Link
      };
    }

    return null;
  }

  getSecondaryActions = () => {
    const { test } = this.props;
    return [
      { content: 'Cancel Test', visible: test.status === 'running' },
      { content: <span><Delete/> Delete Test</span> },
      { content: <span><Save/> Save as Draft</span>, visible: test.status === 'draft' },
      { content: 'Override Default Template', visible: !!test.winning_template_id }
    ];
  }

  render() {
    const { test, loading, error } = this.props;

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

    return (
      <Page
        title={test.name}
        breadcrumbAction={{ content: 'Back to A/B Tests', component: Link, to: '/ab-testing' }}
        primaryAction={this.getPrimaryAction()}
        secondaryActions={this.getSecondaryActions()}>

      </Page>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    test: selectAbTest(state, props),
    loading: state.abTesting.detailsLoading,
    error: state.abTesting.detailsError,
    ...selectIdAndVersion(state, props)
  };
}

export default connect(mapStateToProps, { getAbTest })(DetailsPage);
