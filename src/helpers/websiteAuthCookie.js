import cookie from 'js-cookie';
import config from 'src/config';

const websiteAuthCookie = config.authentication.site.cookie;

function save(data) {
  cookie.set(websiteAuthCookie.name, data, websiteAuthCookie.options);
}

function remove() {
  cookie.remove(websiteAuthCookie.name, websiteAuthCookie.options);
}

export default { save, remove };
