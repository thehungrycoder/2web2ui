import cookie from 'js-cookie';
import config from 'src/config';

const websiteAuthCookie = config.authentication.site.cookie;
const tenant = config.tenant;

function save(data) {
  cookie.set(websiteAuthCookie.name, { ...data, tenant }, websiteAuthCookie.options);
}

function remove() {
  cookie.remove(websiteAuthCookie.name, websiteAuthCookie.options);
}

export default { save, remove };
