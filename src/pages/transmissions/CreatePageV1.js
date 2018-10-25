import React from 'react';
import styles from './CreatePageV1.module.scss';

// You could do this...
class CreatePageV1 extends React.Component {
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
      <div>
        <h1>New Transmission</h1>
        <form onSubmit={this.send}>
          <div>
            <label>Recipient</label>
            <input
              type="text"
              name="recipient"
              onChange={this.handleRecipientChange}
              value={recipient}
            />
          </div>
          <div>
            <label>Template</label>
            <select>
              <option value="">Select a template</option>
              {templates.map(({ name, template_id }) => (
                <option value={template_id}>{name}</option>
              ))}
            </select>
          </div>
          <input className={styles.Submit} type="submit" value="Send" />
        </form>
      </div>
    );
  }
}

export default CreatePageV1;
