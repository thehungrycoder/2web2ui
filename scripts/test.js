

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


jest.run(argv);
