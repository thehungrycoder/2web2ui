import React from 'react';
import { LoadingSVG } from 'src/components/loading/Loading';
import { reduxForm, Field, getFormValues } from 'redux-form';
import styles from '../EditPage.module.scss';
import { Button, Panel, Checkbox } from '@sparkpost/matchbox';
import { CheckboxWrapper } from 'src/components/reduxFormWrappers';
import { connect } from 'react-redux';
import { showAlert } from 'src/actions/globalAlert';
import { withRouter } from 'react-router-dom';
import { getLatestJob, getJobStatus } from 'src/actions/recipientValidation';
import { PollContext } from 'src/context/Poll';
import withContext from 'src/context/withContext';

const CHECKBOXES = [
  { value: 'role_based', label: 'Role Based Email' },
  { value: 'invalid_recipient', label: 'Invalid Recipient' },
  { value: 'disposable_domain', label: 'Disposable Domain' },
  { value: 'invalid_domain', label: 'Invalid Domain' },
  { value: 'invalid_syntax', label: 'Invalid Email Syntax' }
];

class ValidationStatusPanel extends React.Component {

  state = {
    complete: false
  }

  componentDidMount() {
    const { results, stopPolling, startPolling } = this.props;

    this.props.getLatestJob().then(({ list_id }) => {
      if (list_id) {
        stopPolling(list_id);
        if (!results.complete) {
          this.handlePoll(list_id);
          startPolling({
            key: list_id,
            action: () => this.handlePoll(list_id),
            interval: 5000
          });
        }
      }
    });
  }

  componentDidUpdate() {

  }

  onCheckboxChange = (e) => {
    this.setState({ checkbox: !this.state.checkbox });
  }

  handlePoll = (id) => {
    const { showAlert, getJobStatus, stopPolling } = this.props;
    return getJobStatus(id).then(({ complete }) => {
      if (complete) {
        this.setState({ complete: true });
        stopPolling(id);
        showAlert({
          type: 'success',
          message: 'Recipient List Ready to be Filtered.'
        });
      }
    });
  }

  onSubmit = (values) => {
    const { filterRecipientList, showAlert, history } = this.props;
    return filterRecipientList(values).then(({ id }) => {
      history.push(`/lists/recipient-lists/edit/${id}`);
      showAlert({
        type: 'success',
        message: 'Created New Recipient List'
      });
    });
  }

  render() {
    return (
      <Panel title="List Validation">
        {this.state.complete ? (
          <div style={{ padding: '20px' }}>
            <h6>Validation Complete</h6>
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
              <label>Which groups would you like to remove?</label>
              <Checkbox.Group>
                {CHECKBOXES.map((data) => (
                  <Field
                    name={data.value}
                    label={data.label}
                    component={CheckboxWrapper}
                  />
                ))}
              </Checkbox.Group>
              <Button type="submit" fullWidth color='orange'>Create New Recipient List</Button>
            </form>
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            <div className={styles.LoadingWrapper}>
              <h6>Validation Pending</h6>
              <LoadingSVG size='Large' />
            </div>
          </div>
        )}
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  const latestId = state.recipientValidation.latest;
  return {
    latestId,
    results: state.recipientValidation.jobResults[latestId] || {},
    formValues: getFormValues('validateList')(state)
  };
};

const mapDispatchToProps = {
  showAlert,
  getJobStatus,
  getLatestJob

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'validateList' })(withContext(PollContext, ValidationStatusPanel))));
