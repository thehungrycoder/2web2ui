

## Handling sentry issues on unsupported browsers. 

We've a list of browsers that we officially support. The list is maintained using browserlists query which is available in package.json. 

Other than some tools using that tool, we also use the query to detect if an user is using one of the browsers we officially support. Any error from our bundle on an unsupported browser will be marked as `warning` (in contrast to `error`) in Sentry. 

### How it works?
- `scripts/browsersSnapshotGen.js` is responsible for reading the query from `package.json` and return a list of browsers that we support. 
- This script returns a list that is understood by `bowser` npm library. The structure of the output is like:
  ```
    { 
      "mobile": {
        "chrome": ">49"
        ....
      },
      "desktop": {
        "firefox" ">55"
        ....
      }
    }
  ```  
- `src/helpers/errorTracker.js` has a variable named `SUPPORTED_BROWSERS`. When webpack bundle is created, this variable gets replaced by actual JSON string of list of browsers.  
See [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) for more details about how it works. 
Refer to `config/webpack.config.dev.js` and `config/webpack.config.prd.js` for its usage.

IMPORTANT: At runtime, there won't be any variable named `SUPPORTED_BROWSERS` available. It's because it'll be replaced with value by DefinePlugin. 

- On `src/helpers/errorTracker.js`, this list of browsers are compared against user's agent. If current agent doesn't satisfy the rule of supported browser, we mark the Sentry issue as `warning`.

     
### Tests
Because `SUPPORTED_BROWSERS` browser won't get replaced unless it's processed by webpack, tests will not work as it'll complained that `SUPPORTED_BROWSERS` is not defined anywhere. 
That's why we've added as a global variable in jest's config file (`jest.config.js`). 
