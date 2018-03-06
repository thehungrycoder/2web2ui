/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { Grid, Panel, TextField, Modal, Button, Tag, Checkbox, Tooltip } from '@sparkpost/matchbox';
import DateFilter from 'src/pages/reports/components/DateFilter';
// import { FilterDropdown, TextFieldWrapper } from 'src/components';

const tagWrapper = {
  marginRight: 6,
  marginLeft: 6
};

const boxWrapper = {
  display: 'inline-block',
  width: '25%'
};
class AdvancedFiltersPrototype extends Component {
  state = {
    modalOpen: false
  }

  render() {
    return (
      <React.Fragment>
        <Panel>
          <Panel.Section>
            <Grid>
              <Grid.Column xs={5}>
                <DateFilter />
              </Grid.Column>
              <Grid.Column xs={5}>
                <TextField placeholder='Search by recipient'/>
              </Grid.Column>
              <Grid.Column xs={2}>
                <Button
                  fullWidth
                  onClick={() => this.setState({ modalOpen: true })}>
                  More Filters
                </Button>
              </Grid.Column>
            </Grid>
          </Panel.Section>
          <Panel.Section>
            <small>Filters:</small>
            <Tag style={tagWrapper} onRemove={() => (console.log('remove'))}>
              Event: Injection
            </Tag>
            <Tag style={tagWrapper} onRemove={() => (console.log('remove'))}>
              Event: Bounce
            </Tag>
            <Tag style={tagWrapper} onRemove={() => (console.log('remove'))}>
              Recipient: 123@hoolimail.com
            </Tag>
          </Panel.Section>
        </Panel>

        <Modal open={this.state.modalOpen}>
          <Panel title='Advanced Filters'>
            <Panel.Section>
              <Checkbox.Group label='Event Type'>
                <div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Bounce' /></Tooltip></div>
                <div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Out of Band' /></Tooltip></div>
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
                <div style={boxWrapper}><Tooltip content='🤷‍♂️' dark><Checkbox label='Spam Complaint' /></Tooltip></div>
              </Checkbox.Group>
            </Panel.Section>
            <Panel.Section>
              <Grid>
                <Grid.Column xs={6}>
                  <TextField label='Subaccount' placeholder='this should be typeahead'/>
                  <TextField label='Message ID'/>
                </Grid.Column>
                <Grid.Column xs={6}>
                  <TextField label='Template ID'/>
                  <TextField label='Campaign'/>
                </Grid.Column>
              </Grid>
            </Panel.Section>
            <Panel.Section>
              <Button primary onClick={() => this.setState({ modalOpen: false })}>Apply</Button>
              <Button style={{ marginLeft: 6 }} onClick={() => this.setState({ modalOpen: false })}>Reset</Button>
              <Button style={{ float: 'right' }} onClick={() => this.setState({ modalOpen: false })}>Cancel</Button>
            </Panel.Section>
          </Panel>
        </Modal>
      </React.Fragment>
    );
  }
}

const formName = 'msgEventsAdvancedFilter';
const formOptions = { form: formName };

const mapStateToProps = ({ reportOptions }) => ({ reportOptions });

export default connect(
  mapStateToProps
)(reduxForm(formOptions)(AdvancedFiltersPrototype));


{ /* <FilterDropdown
  formName='msgEventsBasicFilter'
  namespace='type'
  displayValue='Event Type'
  options={[
    { name: 'bounce', content: 'Bounce' },
    { name: 'delivery', content: 'Delivery' },
    { name: 'injection', content: 'Injection' },
    { name: 'injection', content: 'Injection' },
    { name: 'bounce', content: 'Bounce' },
    { name: 'delivery', content: 'Delivery' },
    { name: 'injection', content: 'Injection' },
    { name: 'injection', content: 'Injection' },
    { name: 'bounce', content: 'Bounce' },
    { name: 'delivery', content: 'Delivery' },
    { name: 'injection', content: 'Injection' },
    { name: 'injection', content: 'Injection' }
  ]}
/> */ }
