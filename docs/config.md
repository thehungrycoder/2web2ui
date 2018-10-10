# Phoenix UI Configuration

## Using Config In Code

```js
import config from 'src/config'
```

The configuration module under `src/config/` merges variables from these locations in order:

 - `src/config/default.js`
 - `SP.productionConfig` from the current tenant's config file (see below)
 - `src/config/test-config.js` if NODE_ENV==='test'

## Default Configuration

Any variables you'd like to use across all environments and tenants go in `src/config/default.js`.

## Per-Environment Overrides

### Test Environment
Test config is active during `npm run test`

Put test-time values in `src/config/test-config.js`.


## Tenant Configurations

Our build generates a configuration script,  `build/public/static/tenant-config/<host>/production.js`, for each tenant.  The script is loaded by `build/public/static/index.html` for a request host (see `Ansible-Deployments/roles/ui_tier/templates/web_proxy.conf.j2` for more details).  The script sets a global variable, `window.SP.productionConfig`, that is merged in the `src/config` module.


## Configuration

All the magic happens in `scripts/generateConfigs`.  The following are the maps used to generate the tenant configuration scripts.

- `tenants/<environment>.js` - tenant configurations, environment dictates which environment configuration to merge with
- `environments/<environment>.js` - environment configurations
- `defaultTemplate.js` - defaults for all tenants

Please note that `constructContent.js` ignores (by deconstructing) some configuration value that are only used during generation.


### Local Development

Since there is no build, there are no tenant configuration scripts.  Therefore, `public/static/tenant-config/production.js` is used.


### Manual Test

To manually test generated tenant configurations, run `npm run build` and confirm the tenant configuration, `build/public/static/tenant-config/<host>/production.js`, looks as you expect.
