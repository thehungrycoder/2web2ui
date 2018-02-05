import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Panel } from '@sparkpost/matchbox';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';


export class DefaultTrackingForm extends Component {
  render() {
    const { updateLoading, onChange } = this.props;
    return (
      <Panel sectioned title='Engagement Tracking'>
        <p>Engagement tracking allows the ability to show how many recipients opened messages or clicked links. This is the default setting for engagement tracking for SMTP.</p>
        <Field
          name='options.smtp_tracking_default'
          component={ToggleBlock}
          label='SMTP Engagement Tracking'
          type='checkbox'
          disabled={updateLoading}
          onChange={onChange}
        />
      </Panel>
    );
  }

}

const mapStateToProps = ({ account }) => ({
  updateLoading: account.updateLoading,
  initialValues: {
    ...account
  }
});

const formOptions = {
  form: 'smtpDefaultOptions'
};

export default connect(mapStateToProps)(reduxForm(formOptions)(DefaultTrackingForm));
