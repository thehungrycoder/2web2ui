import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Page, Panel, Tabs } from '@sparkpost/matchbox';
import AddForm from './components/AddForm';
import UploadForm from './components/UploadForm';
import { ErrorBanner } from './components/ErrorBanner';
import { resetErrors } from 'src/actions/suppressions';

const tabs = [
  {
    content: 'Single Recipient'
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
          {selectedTab === 1 ? <UploadForm /> : <AddForm />}
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
