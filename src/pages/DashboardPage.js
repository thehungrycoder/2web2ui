import React, { Component } from 'react';
import { connect } from 'react-redux';

export class DashboardPage extends Component {
  renderKeyValue (object, key) {
    return (
      <tr key={key}>
        <td>{key}</td>
        <td>{JSON.stringify(this.props[object][key])}</td>
      </tr>
    );
  }

  render () {
    return (
      <div>
        <h1>My Dashboard</h1>
        <table>
          <thead>
            <tr><th colSpan={2} style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Account</th></tr>
            <tr><th style={{ padding: '5px 0' }}>Key</th><th>Value</th></tr>
          </thead>
          <tbody>
            {this.props.account ? Object.keys(this.props.account).map((key) => this.renderKeyValue('account', key)) : null}
          </tbody>
        </table>

        <br />
        <br />

        <table>
          <thead>
            <tr><th colSpan={2} style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>User</th></tr>
            <tr><th style={{ padding: '5px 0' }}>Key</th><th>Value</th></tr>
          </thead>
          <tbody>
            {this.props.currentUser ? Object.keys(this.props.currentUser).map((key) => this.renderKeyValue('currentUser', key)) : null}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(({ account, currentUser }) => ({ account, currentUser }))(DashboardPage);
