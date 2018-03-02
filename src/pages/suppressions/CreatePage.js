import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Page, Panel, Tabs } from '@sparkpost/matchbox';
import UploadTab from './components/Upload';
import AddTab from './components/Add';
import { ErrorBanner } from './components/ErrorBanner';
import { resetErrors } from 'src/actions/suppressions';

const tabs = [
  {
    content: 'Add'
  },
  {
    content: 'Bulk Upload'
  }
];

export class CreatePage extends Component {
  state = {
    selectedTab: 0
  };

  handleTabs(idx) {
    this.setState({ selectedTab: idx });
    this.props.resetErrors();
  }

  renderAdd() {
    return (
      <AddTab />
    );
  }

  renderUpload() {
    return (
      <UploadTab />
    );
  }

  render() {
    const { selectedTab } = this.state;
    const { persistError, parseError } = this.props;

    return (
      <Page
        title="Add Suppressions"
        breadcrumbAction={{ content: 'Suppressions', Component: Link, to: '/lists/suppressions' }}
      >
        {(parseError || persistError) && (
          <ErrorBanner
            parseError={parseError}
            persistError={persistError}
          />
        )}
        <Tabs
          selected={selectedTab}
          connectBelow={true}
          tabs={tabs.map(({ content }, idx) => ({ content, onClick: () => this.handleTabs(idx) }))}
        />
        <Panel>
          { selectedTab === 1 ? this.renderUpload() : this.renderAdd() }
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  persistError: state.suppressions.persistError,
  parseError: state.suppressions.parseError
});

export default connect(mapStateToProps, { resetErrors })(CreatePage);

