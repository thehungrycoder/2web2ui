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

# Per-Tenant Overrides
Ansible generates `public/static/tenant-config/<tenant-hostname>.js` for each tenant. The format of this file is a little different than the others since it's loaded at runtime.

Tenant config is stored under `window.SP.productionConfig` and then merged with defaults in the config module. 

The app then loads a fixed tenant config URL which Nginx on the UI tier routes to the current tenant's config file. See `A-D/roles/ui_tier/templates/web_proxy.conf.j2` for details.

### Development Environment
Start your dev environment by running `npm start` :)

Put dev values in `public/static/tenant-config/production.js`.

Note: we tend to use `.sparkpost.test` domains during development.

