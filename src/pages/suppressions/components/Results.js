import React, { Component } from 'react';
import { connect } from 'react-redux';


class Results extends Component {
  renderPlaceholder() {
    return (
        <div>
            <h3>Query results will be displayed here</h3>
            <p>Choose some options and search to see your suppressions.</p>
        </div>
    );
  }

  renderResults() {
    return (
      <h1>Resultset coming here</h1>
    );
  }

  render() {
    const { results = []} = this.props;

    return results.length ? this.renderResults() : this.renderPlaceholder();
  }
}

export default connect(null, {})(Results);
