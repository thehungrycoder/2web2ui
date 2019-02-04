import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { listAlerts } from 'src/actions/alerts';

export class ListPageContainer extends Component {
  componentDidMount() {
    this.props.listAlerts();
  }

  render() {
    const { component: Component } = this.props;
    return <Component />;
  }
}

function withAlertsList(WrappedComponent) {
  const Wrapper = (props) => (
    <ListPageContainer {...props} component={WrappedComponent} />
  );

  Wrapper.displayName = `withAlertsList(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  const mapStateToProps = (state, props) => ({
    list: state.alerts.list
  });

  return withRouter(connect(mapStateToProps, { listAlerts })(Wrapper));
}

export default withAlertsList;
