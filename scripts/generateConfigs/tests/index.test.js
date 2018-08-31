const { execSync } = require('child_process');
const fs = require('fs-extra');
const cases = require('jest-in-case');
const constructConfig = require('../constructConfig');
const tenants = require('../tenants');

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
  const tmpDeploymentPath = '/var/tmp/phoenix';
  const tmpTenantConfigPath = `${tmpDeploymentPath}/current/static/tenant-config`;
  const tmpPath = `${process.cwd()}/tmp`;

  const readProductionConfig = (host) => {
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

  // Setup
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

    fs.unlinkSync(`${tmpPath}/phoenix-next-prd.sparkpost.com`);
    fs.unlinkSync(`${tmpPath}/phoenix-next-stg.sparkpost.com`);
    fs.unlinkSync(`${tmpPath}/phoenix-next.tst.sparkpost.com`);
    fs.unlinkSync(`${tmpPath}/phoenix-origin-prd.sparkpost.com`);
    fs.unlinkSync(`${tmpPath}/phoenix-origin-stg.sparkpost.com`);
    fs.unlinkSync(`${tmpPath}/phoenix-origin.tst.sparkpost.com`);
  })

  cases('generateConfigs', ({ name, ...tenant }) => {
    const { alias, context, host, tenantId, ...config } = constructConfig({ ...tenant, tenantId: name });
    const prevConfig = readProductionConfig(host);

    expect(prevConfig).toEqual(config);
  }, tenants);

  it('should not be missing tenants', () => {
    const prevTenantCount = fs.readdirSync(tmpPath).length;
    const tenantCount = Object.keys(tenants).length;

    expect(prevTenantCount).toEqual(tenantCount);
  });
})
