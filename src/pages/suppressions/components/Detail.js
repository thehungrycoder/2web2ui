import React, { Component } from 'react';
import _ from 'lodash';

import { connect } from 'react-redux';
import { DeleteModal } from 'src/components/modals';

export class Detail extends Component {

  render() {
    const { suppression, open, onCancel } = this.props;

    return (
      <div>
        <DeleteModal
          open={open}
          title={`Suppression detail ${suppression.recipient}`}
          content={<p>
            Suppression details will be here
          </p>}
          isPending={false}
          onCancel={onCancel}
          onConfirm={_.noop}
        />
      </div>
    );
  }

}

const mapStateToProps = (state, props) => ({ suppression: props.suppression });
export default connect(mapStateToProps, {})(Detail);
