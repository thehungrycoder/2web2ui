import React from 'react';
import {
  Button,
  Page,
  Panel,
  Select,
  TextField
} from '@sparkpost/matchbox';

// with Matchbox
class CreatePageV2 extends React.Component {
  state = {
    recipient: '',
    templates: []
  }

  componentDidMount() {
    // fetch list of templates
  }

  handleRecipientChange = (event) => {
    this.setState({ recipient: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    // send transmission
  }

  render() {
    const { recipient, templates } = this.state;

    return (
      <Page
        title="New Transmission"
        primaryAction={{
          component: Button,
          content: 'Send Transmission',
          onClick: this.handleSubmit
        }}
      >
        <Panel sectioned>
          <form>
            <TextField
              label="Who will receive this transmission?"
              onChange={this.handleRecipientChange}
              placeholder="Enter a recipient email address"
              value={recipient}
            />
            <Select
              label="What will this transmission contain?"
              options={[
                { label: 'Select a template', value: '' },
                ...templates.map(({ name, template_id }) => ({ label: name, value: template_id }))
              ]}
            />
          </form>
        </Panel>
      </Page>
    );
  }
}

export default CreatePageV2;
