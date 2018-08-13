'use strict';

const browserslist = require('browserslist');
const _ = require('lodash');
const caniuse = require('caniuse-db/data.json').agents;
const fs = require('fs');
const queryResults = browserslist(); //automatically reads configuration from package.json

const destinationPath = './browsers/snapshot.js';

function generate () {
  const compatible = {};

  _.map(queryResults, (browser) => {
    browser = browser.split(' ');

    const brand = browser[0];
    const version = browser[1];

    const db = caniuse[brand];

    if (!compatible[db.type]) {
      compatible[db.type] = {};
    }

    compatible[db.type][db.browser.toLowerCase()] = `>${version}`;
  });

  const content = `const list = ${JSON.stringify(compatible, null, 2)};

  console.log('HELLO WORLD', list);  
  export default list;
  `;

  fs.writeFileSync(destinationPath, content, 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }

    console.log('Browsers snapshot saved!');
  });
}

module.exports = generate;
