import React, { Component } from 'react';
import _ from 'lodash';

import { connect } from 'react-redux';
import { DeleteModal } from 'src/components/modals';
import { Button } from '@sparkpost/matchbox';

export class Detail extends Component {
  state = {
    modalOpen: false
  }

  componentWillUnmount() {
    this.setState({
      modalOpen: false
    });
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  }


  render() {
    const { suppression } = this.props;
    const { modalOpen } = this.state;

    return (
      <div>
        <Button size='small' onClick={() => this.toggleModal()}>View detail</Button> &nbsp;
        { modalOpen && <DeleteModal
          open={modalOpen}
          title={`Suppression detail ${suppression.recipient}`}
          content={<p>
            Suppression details will be here
          </p>}
          isPending={false}
          onCancel={this.toggleModal}
          onConfirm={_.noop}
        />
        }
      </div>
    );
  }

}

const mapStateToProps = (state, props) => ({ suppression: props.suppression });
export default connect(mapStateToProps, {})(Detail);
