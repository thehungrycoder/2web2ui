import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { Link, withRouter } from 'react-router-dom';

import { showAlert } from 'src/actions/globalAlert';
import { updateDraft } from 'src/actions/abTesting';
import { selectEditInitialValues } from 'src/selectors/abTesting';

import { Page, UnstyledLink, Button, Popover, ActionList } from '@sparkpost/matchbox';
import { Save } from '@sparkpost/matchbox-icons';
import Section from './components/Section';
import StatusPanel from './components/StatusPanel';
import StatusFields from './components/fields/StatusFields';
import SettingsFields from './components/fields/SettingsFields';
import { StatusContent, SettingsContent, VariantsContent } from './components/content';

const FORM_NAME = 'abTestEdit';

export class EditMode extends Component {

  handleSaveAsDraft = (values) => {
    const { updateDraft, subaccountId, showAlert } = this.props;
    const { id } = this.props.test;

    return updateDraft(values, { id, subaccountId }).then(() => {
      showAlert({ type: 'success', message: 'A/B Test Draft Updated' });
    });
  }

  getPrimaryAction = () => {
    const { status } = this.props.test;

    if (status === 'draft') {
      return {
        content: 'Finalize and Schedule Test'
      }
    }

    return {
      content: 'Update Test'
    };
  }

  getSecondaryActions = () => {
    const { test, deleteAction, handleSubmit } = this.props;
    return [
      {
        content: <span><Save/> Save as Draft</span>,
        visible: test.status === 'draft',
        onClick: handleSubmit(this.handleSaveAsDraft)
      },
      deleteAction
    ];
  }

  render() {
    const { breadcrumbAction, test, subaccountId, formValues, submitting } = this.props;
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
            <StatusFields disabled={submitting} />
          </Section.Right>
        </Section>

        <Section title='Settings'>
          <Section.Left>
            <SettingsContent test={test} />
          </Section.Left>
          <Section.Right>
            <SettingsFields test={test} formValues={formValues} disabled={submitting} />
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

EditMode.propTypes = {
  test: PropTypes.shape({
    status: PropTypes.oneOf(['draft', 'scheduled'])
  })
}

const mapStateToProps = (state, props) => ({
  formValues: getFormValues(FORM_NAME)(state),
  initialValues: selectEditInitialValues(state, props)
});

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true
};
export default withRouter(connect(mapStateToProps, { updateDraft, showAlert })(reduxForm(formOptions)(EditMode)));
