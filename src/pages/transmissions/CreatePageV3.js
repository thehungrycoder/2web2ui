import React from 'react';
import {
  Button,
  Page,
  Panel,
  Select,
  TextField
} from '@sparkpost/matchbox';

// with Redux
class CreatePageV3 extends React.Component {
  state = {
    recipient: '',
    template: ''
  }

  componentDidMount() {
    this.props.listTemplates();
  }

  componentDidUpdate(prevProps) {
    const { sentTo } = this.props;

    if (prevProps.sentTo.length < sentTo.length) {
      this.props.showAlert({
        message: `Sent transmission to ${sentTo[sentTo.length - 1]}!`,
        type: 'success'
      });
    }
  }

  handleRecipientChange = (event) => {
    this.setState({ recipient: event.target.value });
  }

  handleTemplateChange = (event) => {
    this.setState({ template: event.target.value });
  }

  handleSubmit = () => {
    const { recipient, template } = this.state;
    this.props.sendTransmission({ recipient, template });
  }

  render() {
    const { recipient } = this.state;
    const { sending, templates } = this.props;

    return (
      <Page
        title="New Transmission"
        primaryAction={{
          component: Button,
          content: 'Send Transmission',
          onClick: this.handleSubmit,
          disabled: Boolean(sending)
        }}
      >
        <Panel sectioned>
          <form>
            <TextField
              disabled={Boolean(sending)}
              label="Who will receive this transmission?"
              onChange={this.handleRecipientChange}
              placeholder="Enter a recipient email address"
              value={recipient}
            />
            <Select
              disabled={Boolean(sending)}
              label="What will this transmission contain?"
              onChange={this.handleTemplateChange}
              options={[
                { label: 'Select a template', value: '' },
                ...templates.map(({ id, name }) => ({ label: name, value: id }))
              ]}
            />
          </form>
        </Panel>
      </Page>
    );
  }
}

export default CreatePageV3;
