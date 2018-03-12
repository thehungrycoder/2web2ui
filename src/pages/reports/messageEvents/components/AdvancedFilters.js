/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { updateMessageEventsSearchOptions } from 'src/actions/messageEvents';
import { Field } from 'redux-form';
import { Grid, Panel, Modal, Button, Tag, Checkbox, Tooltip } from '@sparkpost/matchbox';
import { TextFieldWrapper, CheckboxWrapper } from 'src/components';
import { snakeToFriendly } from 'src/helpers/string';
import _ from 'lodash';

const tagWrapper = {
  marginRight: 6,
  marginLeft: 6
};

const boxWrapper = {
  display: 'inline-block',
  width: '25%'
};

const events = [
  { name: 'delivery', tooltip: '' },
  { name: 'injection', tooltip: '' },
  { name: 'bounce', tooltip: '' },
  { name: 'delay', tooltip: '' },
  { name: 'policy_rejection', tooltip: '' },
  { name: 'out_of_band', tooltip: '' },
  { name: 'open', tooltip: '' },
  { name: 'initial_open', tooltip: '' },
  { name: 'click', tooltip: '' },
  { name: 'generation_failure', tooltip: '' },
  { name: 'generation_rejection', tooltip: '' },
  { name: 'spam_complaint', tooltip: '' },
  { name: 'list_unsubscribe', tooltip: '' },
  { name: 'link_unsubscribe', tooltip: '' }
];

class AdvancedFilters extends Component {
  state = {
    modalOpen: false
  }

  static defaultProps = {
    values: {}
  }

  parseLists = (value) => {
    value = _.trim(value, ' ,'); // strip whitespace and commas
    if (!value) {
      return [];
    }

    return value.split(',').map((item) => _.trim(item));
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  handleApply = () => {
    const { values, updateMessageEventsSearchOptions } = this.props;
    const { friendly_froms, subaccounts, events } = values;

    const parsedEvents = _.keys(_.pickBy(events));

    updateMessageEventsSearchOptions({ events: parsedEvents })
    this.toggleModal();
  }

  renderEvent = ({ name, label, tooltip }) => (
    <div style={boxWrapper} key={name}>
      <Tooltip content={tooltip} dark>
        <Field
          name={`events.${name}`}
          label={snakeToFriendly(name)}
          component={CheckboxWrapper}
        />
      </Tooltip>
    </div>
  );

  render() {

    return (
      <React.Fragment>
        <Button fullWidth onClick={this.toggleModal}>More Filters</Button>
        <Modal open={this.state.modalOpen}>
          <Panel title='Advanced Filters'>
            <Panel.Section>
              <Checkbox.Group label='Event Type'>
                {events.map(this.renderEvent)}
              </Checkbox.Group>
            </Panel.Section>
            <Panel.Section>
              <Grid>
                <Grid.Column xs={6}>
                  <Field
                    name="friendly_froms"
                    component={TextFieldWrapper}
                    title="From Email Address(es)"
                    placeholder="Filter by from email address"
                  />
                  <Field
                    name="subaccounts"
                    component={TextFieldWrapper}
                    title="Subaccount ID(s)"
                    placeholder="Filter by subaccount IDs"
                  />
                  <Field
                    name="message_ids"
                    component={TextFieldWrapper}
                    title="Message ID(s)"
                    placeholder="Filter by message IDs"
                  />
                </Grid.Column>
                <Grid.Column xs={6}>
                  <Field
                    name="template_ids"
                    component={TextFieldWrapper}
                    title="Template ID(s)"
                    placeholder="Filter by template IDs"
                  />
                  <Field
                    name="campaign_ids"
                    component={TextFieldWrapper}
                    title="Campaigns(s)"
                    placeholder="Filter by campaigns"
                  />
                </Grid.Column>
              </Grid>
            </Panel.Section>
            <Panel.Section>
              <Button primary onClick={this.handleApply}>Apply</Button>
              {/* <Button style={{ marginLeft: 6 }} onClick={() => this.setState({ modalOpen: false })}>Reset</Button> */}
              <Button style={{ float: 'right' }} onClick={this.toggleModal}>Cancel</Button>
            </Panel.Section>
          </Panel>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    values: getFormValues(props.formName)(state),
  }
};
export default connect(mapStateToProps, { updateMessageEventsSearchOptions })(AdvancedFilters);

{/* <div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Out of Band' /></Tooltip></div>
<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Initial Open' /></Tooltip></div>
<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Generation Failure' /></Tooltip></div>

<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Delivery' /></Tooltip></div>
<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Policy Rejection' /></Tooltip></div>
<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Open' /></Tooltip></div>
<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Generation Rejection' /></Tooltip></div>

<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Injection' /></Tooltip></div>
<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Delay' /></Tooltip></div>
<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Click' /></Tooltip></div>
<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='List Unsubscribe' /></Tooltip></div>
<div style={boxWrapper}/>
<div style={boxWrapper}/>

<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Link Unsubscribe' /></Tooltip></div>
<div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Spam Complaint' /></Tooltip></div> */}
