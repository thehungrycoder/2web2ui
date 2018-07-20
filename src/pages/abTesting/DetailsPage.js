import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { Page, UnstyledLink, Panel, Button } from '@sparkpost/matchbox';
import { OpenInNew, Save, Delete } from '@sparkpost/matchbox-icons';
import { LabelledValue } from 'src/components';

import Section from './components/Section';
import { StatusPanel, StatusDatesPanel } from './components/StatusComponents';
import { SettingsPanel } from './components/SettingsComponents';
import { VariantsPanels } from './components/VariantComponents';
import styles from './DetailsPage.module.scss';

import data from './data'; // fake data
import _ from 'lodash';


class DetailsPage extends Component {
  static defaultProps = {
    formValues: {}
  }

  getEndText = () => {
    const { test } = this.props;

    if (test.test_mode === 'bayesian' && test.audience_selection === 'sample_size') {
      return ', confidence level, or sample size';
    }
    if (test.test_mode === 'bayesian') {
      return ', or confidence level';
    }
    if (test.audience_selection === 'sample_size') {
      return ', or sample size';
    }
  }

  render() {
    const { test, formValues } = this.props;

    const learnMore = <p><UnstyledLink to='#'>Learn more about configuring AB tests <OpenInNew/></UnstyledLink></p>;
    let primaryAction = { content: 'Update Test Settings' };
    let statusContent = null;
    let settingsContent = null;

    if (test.status === 'draft') {
      primaryAction = { content: 'Schedule Test' };
      statusContent = <p>To begin this test, schedule a start and end date.</p>;
      settingsContent = <React.Fragment><p>You may continue to adjust these settings and template variants while this test is in draft mode.</p>{learnMore}</React.Fragment>;
    }

    if (test.status === 'cancelled' || test.status === 'completed') {
      primaryAction = { content: 'Edit and Rerun Test' };
    }

    if (test.status === 'scheduled') {
      statusContent = <p>This test has been scheduled.</p>;
      settingsContent = <React.Fragment><p>You may continue to adjust these settings and template variants until the start date has been reached.</p>{learnMore}</React.Fragment>;
    }

    if (test.status === 'completed') {
      statusContent = <React.Fragment>
        <p>This test has concluded, and is now sending the {test.test_mode === 'bayesian' ? 'winning template' : 'default template'}.</p>
        <p>You may override this template if you need to change your transmissions template without starting a new test.</p>
      </React.Fragment>;
      settingsContent = <React.Fragment>{learnMore}</React.Fragment>;
    }

    if (test.status === 'running') {
      primaryAction = null;
      statusContent = <React.Fragment>
        <p>This test is currently running. This test will conclude when the end date{this.getEndText()} has been reached.</p>
      </React.Fragment>;
      settingsContent = <React.Fragment><p>You must first cancel this test to make any changes.</p>{learnMore}</React.Fragment>;
    }

    if (test.status === 'cancelled') {
      statusContent = <p>This test has been cancelled, and has reverted to sending the default template.</p>;
      settingsContent = <React.Fragment>{learnMore}</React.Fragment>;
    }

    return (
      <Page
        title={test.name}
        breadcrumbAction={{ content: 'All Tests', component: Link, to: '/ab-testing' }}
        primaryAction={primaryAction}
        secondaryActions={[
          { content: 'Cancel Test', visible: test.status === 'running' },
          { content: <span><Delete/> Delete Test</span> },
          { content: <span><Save/> Save as Draft</span>, visible: test.status === 'draft' },
          { content: 'Override Default Template', visible: !!test.winning_template_id }
        ]}>

        <Section title='Status'>
          <Section.Left>{statusContent}</Section.Left>
          <Section.Right>
            <StatusPanel test={test} />
            <StatusDatesPanel test={test} />
            {
              test.winning_template_id &&
              <Panel>
                <Panel.Section>
                  <LabelledValue label='Winner'>
                    <h6>{test.winning_template_id}</h6>
                    {
                      test.winning_template_id === test.default_template.template_id &&
                      <p className={styles.HelpText}>No winner was found.</p>
                    }
                    {
                      (test.winning_template_id !== test.default_template.template_id && test.test_mode === 'bayesian') &&
                      <p className={styles.HelpText}>This variant is now being sent by default.</p>
                    }
                  </LabelledValue>
                </Panel.Section>
              </Panel>
            }
          </Section.Right>
        </Section>

        <Section title='Settings'>
          <Section.Left>{settingsContent}</Section.Left>
          <Section.Right>
            <SettingsPanel test={test} formValues={formValues}/>
          </Section.Right>
        </Section>

        <Section title='Variants'>
          <Section.Left>
            <p>The templates you've selected will appear here, along with their results once this test concludes.</p>
            <p>If you need to create a new template, <UnstyledLink to='#'>head over to the templates page</UnstyledLink>.</p>
          </Section.Left>
          <Section.Right>
            <VariantsPanels test={test} formValues={formValues}/>
          </Section.Right>
        </Section>

      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({
  test: _.find(data, { id: props.match.params.id }),
  formValues: getFormValues('abTestFormEdit')(state),
  initialValues: {
    testmode: 'bayesian',
    confidence_level: '0.95',
    engagement_metric: 'click',
    audience_selection: 'percent',
    engagement_timeout: 24,
    engagement_timeout_unit: 'hours'
  }
});

const formOptions = { form: 'abTestFormEdit', enableReinitialize: true };
export default connect(mapStateToProps, { })(reduxForm(formOptions)(DetailsPage));
