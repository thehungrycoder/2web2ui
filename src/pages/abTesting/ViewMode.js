import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Page, UnstyledLink, Button, Popover, ActionList } from '@sparkpost/matchbox';
import { Save } from '@sparkpost/matchbox-icons';
import Section from './components/Section';
import StatusPanel from './components/StatusPanel';
import { StatusContent, SettingsContent, VariantsContent } from './components/content';

export class ViewMode extends Component {

  getPrimaryAction = () => {
    const { status } = this.props.test;

    if (status === 'cancelled' || status === 'completed') {
      return {
        content: 'Edit and Rerun Test'
      }
    }

    return null;
  }

  getSecondaryActions = () => {
    const { test, deleteAction } = this.props;
    return [
      {
        content: 'Cancel Test',
        visible: test.status === 'running'
      },
      {
        content: 'Override Default Template',
        visible: !!test.winning_template_id,
        // onClick: this.toggleOverrideModal()
      },
      deleteAction
    ];
  }

  render() {
    const { breadcrumbAction, test, subaccountId } = this.props;
    const { id } = this.props.test;

    return (
      <Page
        title={id}
        breadcrumbAction={breadcrumbAction}
        primaryAction={this.getPrimaryAction()}
        secondaryActions={this.getSecondaryActions()}>

        <Section title='Status'>
          <Section.Left>
            <StatusContent test={test}  />
          </Section.Left>
          <Section.Right>
            <StatusPanel test={test} subaccountId={subaccountId} />

          </Section.Right>
        </Section>

        <Section title='Settings'>
          <Section.Left>
            <SettingsContent test={test} />
          </Section.Left>
          <Section.Right>

          </Section.Right>
        </Section>

        <Section title='Variants'>
          <Section.Left>
            <VariantsContent test={test} />
          </Section.Left>
          <Section.Right>

          </Section.Right>
        </Section>

      </Page>
    );
  }
}

ViewMode.propTypes = {
  test: PropTypes.shape({
    status: PropTypes.oneOf(['cancelled', 'completed', 'running'])
  })
}

export default ViewMode;
