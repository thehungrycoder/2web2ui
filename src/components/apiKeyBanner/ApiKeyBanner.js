import React, { Component } from 'react';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import { Banner } from '@sparkpost/matchbox';
import { hideNewApiKey } from 'src/actions/api-keys';

export class ApiKeySuccessBanner extends Component {
  state = { copied: false };

  onClickBanner = () => {
    copy(this.props.newKey);
    this.setState({ copied: true });
  }

  render() {
    const {
      title,
      status = 'success',
      hideNewApiKey,
      newKey
    } = this.props;

    const action = {
      content: this.state.copied ? 'Copied to clipboard' : 'Copy',
      onClick: this.onClickBanner
    };

    return (
      <Banner
        action={action}
        title={title}
        status={status}
        onDismiss={hideNewApiKey}
      >
        <p>Make sure to copy your API key now. You won't be able to see it again!</p>
        <strong>{newKey}</strong>
      </Banner>

    );
  }

}

const mapStateToProps = (state) => ({
  newKey: state.apiKeys.newKey
});

export default connect(mapStateToProps, { hideNewApiKey })(ApiKeySuccessBanner);

