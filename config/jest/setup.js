import raf from './tempPolyfills'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

// Provides enzyme assertions.
// See https://github.com/blainekasten/enzyme-matchers#assertions
import 'jest-enzyme';

Enzyme.configure({ adapter: new Adapter() });

// Fail tests on any warning
console.error = message => {
   throw new Error(message);
};
