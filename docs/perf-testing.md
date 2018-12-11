# Performance Testing

This doc outlines the steps required to run a simple user-experience-centric performance test on the app.

# Methodology

The test is designed to gauge quality of experience for desktop users with adequate bandwidth.

# Prerequisites

 - Node 8+
 - Lighthouse - Google's web app auditing tool:
    ```sh
    npm i -g lighthouse
    ```
 - Chrome - Latest stable version

# Running The Audit

This line will run Lighthouse using your stable Chrome browser with the following options:

 - `--disable-device-emulation` - run in "desktop" mode
 - `--throttling-method=provided` - disable network throttling

```sh
CHROME_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome lighthouse --disable-device-emulation --throttling-method=provided --view https://app.sparkpost.com/
```

Once the run completes, the results will display in your browser and will also be saved to HTML file.

Note: if you are confident that you have only 1 version of Chrome, you may omit the `CHROME_PATH` environment variable.

# Testing A Local Build

These steps will build the app, serve it and run Lighthouse on it locally, to remove any network or other infra-related variables.

## Steps
 1. Build the app: `npm run build`
 1. Install serve: `npm i -g serve`
 1. Configure serve by saving this to `serve.json`:
    ```json
    {
      "rewrites": [
        {
          "source": "/static/tenant-config/**/production.js", "destination": "/static/tenant-config/production.js"
        }
      ]
    }
    ```
 1. Serve your build:
    ```sh
    cd build
    serve -c ../serve.json
    ```
 1. Run Lighthouse on your build:
    ```sh
    CHROME_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome lighthouse --disable-device-emulation --throttling-method=provided --view http://app.sparkpost.test:5000/
    ```
