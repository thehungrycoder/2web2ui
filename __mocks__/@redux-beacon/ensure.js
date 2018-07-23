const ensureMock = jest.fn((arg1, arg2) => jest.fn(() => arg2));

export default ensureMock;
