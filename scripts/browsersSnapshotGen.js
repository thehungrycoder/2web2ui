'use strict';

const browserslist = require('browserslist');
const _ = require('lodash');
const caniuse = require('caniuse-db/data.json').agents;
const semver = require('semver');
const packageJson = require('../package.json');

const browserNamesMap = {
  bb: 'BlackBerry',
  and_chr: 'Chrome',
  ChromeAndroid: 'Chrome',
  FirefoxAndroid: 'Firefox',
  ff: 'Firefox',
  ie: 'Explorer',
  ie_mob: 'ExplorerMobile',
  and_ff: 'Firefox',
  ios_saf: 'iOS',
  op_mini: 'OperaMini',
  op_mob: 'OperaMobile',
  and_qq: 'QQAndroid',
  and_uc: 'UCAndroid'
};


const semverify = (version) => {
  if (typeof version === 'string' && semver.valid(version)) {
    return version;
  }

  const split = version.toString().split('.');

  while (split.length < 3) {
    split.push('0');
  }

  return split.join('.');
};


const parseBrowsersList = (browsersList) => {
  const parsed = {};

  _.each(browsersList, browser => {
    const [browserName, browserVersion] = browser.split(' ');
    const platform = caniuse[browserName].type;

    let normalizedName = browserName;
    let normalizedVersion = browserVersion;

    if (browserName in browserNamesMap) {
      normalizedName = browserNamesMap[browserName];
    }

    try {
      // Browser version can return as "10.0-10.2"
      const splitVersion = browserVersion.split('-')[0];
      normalizedVersion = semverify(splitVersion);
    } catch (e) {
    }

    if (!parsed[platform]) {
      parsed[platform] = {};
    }

    parsed[platform][normalizedName.toLowerCase()] = `>${normalizedVersion}`;
  });

  return parsed;
};

const generate = () => {
  const queryResults = browserslist(packageJson.browserslist.production);
  return parseBrowsersList(queryResults);
};

module.exports = generate;
