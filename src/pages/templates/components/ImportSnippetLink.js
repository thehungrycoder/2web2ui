import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from '@sparkpost/matchbox';
import { hasUiOption } from 'src/helpers/conditions/account';
import ImportSnippetPanel from './ImportSnippetPanel.container';

export class ImportSnippetLink extends React.Component {
  state = {
    isOpen: false
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  handleOpen = () => {
    this.setState({ isOpen: true });
  }

  render() {
    const { isFeatureToggledOn } = this.props;

    if (!isFeatureToggledOn) {
      return null;
    }

    return (
      <React.Fragment>
        <Button color="orange" flat={true} onClick={this.handleOpen}>Import Snippets</Button>
        <Modal open={this.state.isOpen} onClose={this.handleClose}>
          <ImportSnippetPanel onClose={this.handleClose} />
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isFeatureToggledOn: hasUiOption('snippets')(state)
});

export default connect(mapStateToProps)(ImportSnippetLink);
