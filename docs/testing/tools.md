# Testing Tools

This project uses the following tools for testing.

## Jest

Jest is the primary testing tool we use, and it serves as the test runner (e.g. mocha), assertion library (e.g. chai), and stubbing/mocking library (e.g. sinon) as well as the watch-mode CLI tool.

* [Jest documentation](https://facebook.github.io/jest/docs/en/getting-started.html)
* [Assertion matchers](https://facebook.github.io/jest/docs/en/expect.html)
* [Creating sinon-like stubs with jest.fn()](https://facebook.github.io/jest/docs/en/jest-object.html#jestfnimplementation)
* [Mock API](https://facebook.github.io/jest/docs/en/mock-function-api.html)
* [Using the Jest CLI](https://facebook.github.io/jest/docs/en/cli.html)

[Read more on Jest mocking here in our own docs](mocking.md).

## Enzyme

Enzyme is a tool built by Airbnb that we use to mimic rendering and mounting for our functional component tests.

* [Enzyme documentation](http://airbnb.io/enzyme/)
* [Shallow rendering](http://airbnb.io/enzyme/docs/api/shallow.html)
* [Event simulation](http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html)
* [Finding rendered sub-elements](http://airbnb.io/enzyme/docs/api/ShallowWrapper/find.html)

## jest-in-case

[placeholder]

I have some thoughts and opinions on if/when we should use this lib. More to come.
