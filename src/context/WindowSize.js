import React, { createContext, Component } from 'react';
import { WindowEvent } from '@sparkpost/matchbox';
import _ from 'lodash';

const defaultContext = {
  mobile: false
};

export const WindowSizeContext = createContext(defaultContext);

/**
 * WindowSizeContext Provider
 * Determines whether a mobile or desktop theme should be applied
 * Does not do much currently, but can be used to replace CSS breakpoints
 * @prop mobile boolean
 */
class WindowSize extends Component {
  state = defaultContext;

  componentDidMount() {
    this.updateSize();
  }

  updateSize = () => {
    this.setState({
      mobile: window.innerWidth < 720
    });
  };

  debouncedUpdateSize = _.debounce(this.updateSize, 300);

  render() {
    return (
      <WindowSizeContext.Provider value={this.state}>
        <WindowEvent event='resize' handler={this.debouncedUpdateSize} />
        {/* Only components that are rendered under this tree will be able to "consume" */}
        {this.props.children}
      </WindowSizeContext.Provider>
    );
  }
}

export default WindowSize;
