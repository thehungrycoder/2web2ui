

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const jest = require('jest');
let argv = process.argv.slice(2);
const pIndex = argv.indexOf('-p');

// allow for `npm run script -- -p some-file-pattern` CLI syntax
if (pIndex >= 0) {
  argv.push(`--testPathPattern=${argv[pIndex + 1]}`);
  argv = argv.filter((option, index) => index !== pIndex && index !== pIndex + 1);
}

// Watch unless on CI or in coverage mode
if (!process.env.CI && argv.indexOf('--coverage') < 0) {
  argv.push('--watch');
}

if (process.env.CI && process.env.TRAVIS) {
  argv.push(
    // prints Jest configuration
    '--debug',

    // TODO This is an experimental feature that is noisy, but could be very beneficial
    // SEE https://github.com/facebook/jest/pull/4895
    // SEE https://github.com/facebook/jest/blob/1918f6beb6b32471304125b31329129b21ebd3ef/website/blog/2017-12-18-jest-22.md#experimental-leak-detection
    // '--detectLeak',

    // prints heap size per test file
    '--logHeapUsage',


    // Jest v22 introduced jest-worker for easy parallelization by forking processes in parallel.  The
    // spawning of each worker is expensive.  The recommendation is number of workers should be number
    // of CPUs minus one.  Our Travis CI free plan only provides a machine with two CPU.
    // SEE https://github.com/facebook/jest/pull/4497/files
    // SEE https://github.com/facebook/jest/blob/1918f6beb6b32471304125b31329129b21ebd3ef/website/blog/2017-12-18-jest-22.md#custom-runners--easy-parallelization-with-jest-worker
    // SEE https://github.com/facebook/jest/blob/a0370ade8aa53dbce95e68d9d01e952bcd2b6f40/docs/Troubleshooting.md#tests-are-extremely-slow-on-docker-andor-continuous-integration-ci-server
    '--maxWorkers=4',

    // prints execution time per test
    '--verbose'
  );
}

jest.run(argv);
