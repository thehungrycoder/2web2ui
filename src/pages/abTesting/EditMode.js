import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { withRouter } from 'react-router-dom';

import { showAlert } from 'src/actions/globalAlert';
import { updateDraft, getAbTest } from 'src/actions/abTesting';
import { listTemplates } from 'src/actions/templates';
import { selectEditInitialValues } from 'src/selectors/abTesting';
import { formatFormValues } from 'src/helpers/abTesting';

import { Page } from '@sparkpost/matchbox';
import { Save } from '@sparkpost/matchbox-icons';
import Section from './components/Section';
import StatusPanel from './components/StatusPanel';
import { StatusFields, SettingsFields, VariantsFields } from './components/fields';
import { StatusContent, SettingsContent, VariantsContent } from './components/content';

const FORM_NAME = 'abTestEdit';

export class EditMode extends Component {

  componentDidMount() {
    // Get templates here for the typeaheads
    // Ensures the list is always up to date
    this.props.listTemplates();
  }

  handleSaveAsDraft = (values) => {
    const { updateDraft, showAlert, subaccountId, getAbTest } = this.props;
    const { id, version } = this.props.test;

    return updateDraft(formatFormValues(values), { id, subaccountId }).then(() => {
      getAbTest({ id, version, subaccountId });
      showAlert({ type: 'success', message: 'A/B Test Draft Updated' });
    });
  }

  handleSchedule = (values) => {}

  handleUpdateScheduled = (values) => {}

  getPrimaryAction = () => {
    const { handleSubmit, test } = this.props;

    if (test.status === 'draft') {
      return {
        content: 'Finalize and Schedule Test',
        onClick: handleSubmit(this.handleSchedule)
      };
    }

    return {
      content: 'Update Test',
      onClick: handleSubmit(this.handleUpdateScheduled)
    };
  }

  getSecondaryActions = () => {
    const { test, deleteAction, cancelAction, handleSubmit } = this.props;
    return [
      {
        content: <span><Save/> Save as Draft</span>,
        visible: test.status === 'draft',
        onClick: handleSubmit(this.handleSaveAsDraft)
      },
      cancelAction,
      deleteAction
    ];
  }

  render() {
    const { breadcrumbAction, test, formValues, submitting, subaccountId } = this.props;

    return (
      <Page
        title={test.name}
        breadcrumbAction={breadcrumbAction}
        primaryAction={this.getPrimaryAction()}
        secondaryActions={this.getSecondaryActions()}>

        <Section title='Status'>
          <Section.Left>
            <StatusContent test={test} />
          </Section.Left>
          <Section.Right>
            <StatusPanel test={test} subaccountId={subaccountId} />
            <StatusFields disabled={submitting} />
          </Section.Right>
        </Section>

        <Section title='Settings'>
          <Section.Left>
            <SettingsContent test={test} />
          </Section.Left>
          <Section.Right>
            <SettingsFields formValues={formValues} disabled={submitting} />
          </Section.Right>
        </Section>

        <Section title='Variants'>
          <Section.Left>
            <VariantsContent test={test} />
          </Section.Left>
          <Section.Right>
            <VariantsFields formValues={formValues} disabled={submitting} subaccountId={subaccountId} />
          </Section.Right>
        </Section>
      </Page>
    );
  }
}

EditMode.defaultProps = {
  formValues: {}
};

EditMode.propTypes = {
  test: PropTypes.shape({
    status: PropTypes.oneOf(['draft', 'scheduled'])
  })
};

const mapStateToProps = (state, props) => ({
  formValues: getFormValues(FORM_NAME)(state),
  initialValues: selectEditInitialValues(state, props)
});

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true
};
export default withRouter(connect(mapStateToProps, { listTemplates, updateDraft, getAbTest, showAlert })(reduxForm(formOptions)(EditMode)));