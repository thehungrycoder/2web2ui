import sinon from 'sinon';

const mock = {
  set: sinon.stub(),
  getJSON: sinon.stub(),
  remove: sinon.stub()
};

export default mock;