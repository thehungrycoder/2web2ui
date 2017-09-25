# SparkPost App

A re-build of the current SparkPost web app using React and Redux.

## Installing dependencies

This project uses `npm5`, so upgrade if you haven't.
```
npm install npm@5 -g
```

Then `npm install` to install deps.

This will start a dev server backed by api.sparkpost.dev with live reload on http://localhost:3100/

## Tests

Running the test suite:
```
npm test
```
**NOTE:** You may need to `brew install watchman` for jest to run in watch mode on OS X.
https://github.com/facebook/react-native/issues/9309#issuecomment-238966924

## About the project

Before jumping into writing code, here are a few things you'll want to be aware of:

1. We use ESLint to enforce automated linting. The config is extended from a few places and defined inside the package.json file, under the "eslintConfig" key (instead of using a root level .eslintrc file).
    * To run our linting, you can run `npm run lint` or `npm run lint -- --fix` to run in "auto fix mode". 
    * Linting is run during the build process but NOT during tests (jest runs tests in watch mode)
    * We are always looking for ways to move things into automated linting instead of just having "conventions" listed later in this section.
    * We should consider looking at some combination of prettier and eslint at some point.

1. **File and folder names:** everything is camelCase except for component files and other class-only files, which are PascalCase. When in doubt, file names should match the default export's function/class/variable name.

1. **index.js "directory" files:** when there are 3 or more components in a sub-directory (e.g. src/pages/webhooks), export all of them inside of an index.js file there, for easier and less verbose imports elsewhere.

1. **Sub-directory groups:** Any time you have more than one file making up a component or related set of components, put them in a sub-directory (e.g. src/components/collection/*)

1. **Magic module resolution:** we use webpack tomfoolery and jest shenanigans to make our modules resolve relative to `src/`, so you can `import something from whatever/yeah` so long as there is a `src/whatever/yeah.js` file. And so on. You should prefer this style to relative imports unless the files are directly next to each other or are related to each other and no more than one directory away.
    * Note: we should change this to resolve relative to the root, and then ever import from `src/` e.g. `import something from 'src/whatever/yeah'` to limit the scope of possible node_modules conflicts. Will need to change all existing references and then edit Jest and Webpack configs.

1. **Don't use lodash `_.chain`.** We use [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash#limitations) to tree-shake our use of lodash so we only have to bundle methods we use, but `_.chain` breaks all of that. If you want to do something like chaining, you can use `flow` from `lodash/fp`, which is somewhat explained in [this article](https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba). 
    * Note: use `flow` and not `compose` bc compose is backwards and weird. ;)
    * Other note: you can import directly from `lodash/fp` because of our babel transform. (e.g. `import { map, flow } from 'lodash/fp'`)

### Testing Conventions

* `tests/` folders are to be included as a sibling to the files they test, with all test files for that folder contained inside the `tests/` directory there.

* We use jest for testing and, as much as possible, for all unit test mocking. See our [jest guide](./docs/jest.md) for how we accomplish this black magic.

* Always prefer to use built in jest assertions over generic equality comparisons:
    ```javascript
    // do this
    expect(fn).toHaveBeenCalledWith(arg1, arg2);
    
    // not this
    expect(fn.mock.calls[0]).toEqual([arg1, arg2]);
    ```

* We use *a lot* of snapshot testing. It works great for anything serializable. We first thought we would keep these tests separate in their own files but that turned out to be a silly idea, Jason. Now we just incorporate them into any test where they make sense, so you'll see lots of `tests/__snapshots__` directories all over.

* We use a good amount of enzyme for any kind of logic testing (simulating actions in a component) or for shallow rendering, usually so we can snapshot test something without testing all of its dependency components.

* We believe in direct regular old unit testing wherever possible, mostly for helpers. In other words, if we don't have to involve react in a test, we don't. 

* We try not to unit test redux, i.e. no tests for connected components or for mapStateToProps functions etc., we mock connected state and actions and pull any mapStateToProps logic into selectors where they can be tested more easily. We do sometimes use redux-mock-store to test chains of dispatches, but in those cases we just end up snapshot testing the dispatch chain.

### Docs

We have two types of internal docs: general and directory-based. You'll find general docs like testing guides and general redux patterns, etc. in [our top level docs folder](./docs), but component directories will often have their own README.md files or docs folders (similar to tests) where individual docs related to those specific components can be found.

![](https://media0.giphy.com/media/5y1LH29N3k556/giphy.gif)
