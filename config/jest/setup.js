import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Provides enzyme assertions.
// See https://github.com/blainekasten/enzyme-matchers#assertions
import 'jest-enzyme';

Enzyme.configure({ adapter: new Adapter() });
