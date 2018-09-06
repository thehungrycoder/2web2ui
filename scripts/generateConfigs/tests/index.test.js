const { execSync } = require('child_process');
const fs = require('fs-extra');
const cases = require('jest-in-case');
const generateConfigs = require('../');
const tenantsByEnvironment = require('../tenants');

/**
 * To use, remove .skip and run directly, npx jest scripts/generateConfigs/tests/index.test.js
 */
describe.skip('generateConfigs', () => {
  const ansibleEnvironments = [
    'consolidated-tst',
    'consolidated-stg',
    'consolidated-prd',
    'consolidated-eu-webui'
  ];
  const buildTenantConfigPath = `${process.cwd()}/build/static/tenant-config`;
  const tmpDeploymentPath = '/var/tmp/phoenix';
  const tmpTenantConfigPath = `${tmpDeploymentPath}/current/static/tenant-config`;
  const tmpPath = `${process.cwd()}/tmp`;

  // Reduce tenants into single object for testing
  const tenants = Object.keys(tenantsByEnvironment).reduce((acc, environment) => {
    Object.keys(tenantsByEnvironment[environment]).forEach((tenantId) => {
      acc[tenantId] = {
        ...tenantsByEnvironment[environment][tenantId],
        environment
      }
    });

    return acc;
  }, {});

  const readBuildTenantConfig = (host) => {
    const js = fs.readFileSync(`${buildTenantConfigPath}/${host}/production.js`, 'utf8');
    let window = {};

    eval(js); // sets window

    return window.SP.productionConfig;
  };

  const readTmpTenantConfig = (host) => {
    const js = fs.readFileSync(`${tmpPath}/${host}/production.js`, 'utf8');
    let window = {};

    eval(js); // sets window

    const {
      featureFlags: {
        allow_mailbox_verification, // all are true which is our default
        sending_domains_v2, // not used by ui
        templatesBySubaccount, // not used by ui
        usage_from_redis, // not used by ui
        ...featureFlags
      },
      gaTag, // no longer used
      smtpAuth: {
        commaFixer, // oh ansible
        ...smtpAuth
      },
      zuora,
      ...productionConfig
    } = window.SP.productionConfig;

    // Ignore zuora sandbox configurations because that is the default
    if (zuora && !/apisandbox/.test(zuora.baseUrl)) {
      productionConfig.zuora = zuora;
    }

    return {
      ...productionConfig,
      featureFlags,
      smtpAuth
    };
  }

  beforeEach(() => {  // should be beforeAll, but it runs even if describe.skip
    // ugh, it takes minutes to run all the playbooks, so only do it once.  If you need to rerun the
    // playbooks, just delete the ./tmp directory
    if (fs.existsSync(tmpPath)) {
      return;
    }

    fs.mkdir(tmpPath);

    // run Ansible Deployment playbook to generate tenant configs and move them to tmp directory
    ansibleEnvironments.forEach((ansibleEnvironment) => {
      fs.emptyDirSync(tmpDeploymentPath);

      // NOTE, assumes A-D is cloned, up to date, and in the same dir as 2web2ui
      execSync(
        `(cd ../Ansible-Deployment && ansible-playbook test_ui_tier_phoenix.yml --inventory-file=site/${ansibleEnvironment}/inventory --extra-vars="site=site/${ansibleEnvironment}/site/site" --user=msysdeploy --private-key=~/.ssh/ecbuild --diff --tags prepare,golive)`
      );

      fs.readdirSync(tmpTenantConfigPath).forEach((dir) => {
        fs.renameSync(`${tmpTenantConfigPath}/${dir}`, `${tmpPath}/${dir}`);
      });
    })
  })

  beforeEach(() => {
    if (fs.existsSync(buildTenantConfigPath)) {
      return;
    }

    fs.mkdirpSync(buildTenantConfigPath);
    generateConfigs();
  })

  it('should not be missing tenants', () => {
    const prevTenantList = fs.readdirSync(tmpPath);
    const tenantList = fs.readdirSync(buildTenantConfigPath);

    expect(prevTenantList).toEqual(tenantList);
  });

  fs.readdirSync(tmpPath).forEach((host) => {
    it(`for ${host}`, () => {
      const prevConfig = readTmpTenantConfig(host);
      const nextConfig = readBuildTenantConfig(host);

      expect(prevConfig).toEqual(nextConfig);
    })
  })
})