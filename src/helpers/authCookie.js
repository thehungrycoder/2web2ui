import cookie from 'js-cookie';
import config from 'src/config';

const authCookie = config.authentication.app.cookie;

function save(data) {
  cookie.set(authCookie.name, data, authCookie.options);
}

function merge(data) {
  const merged = Object.assign(get() || {}, data);
  save(merged);
  return merged;
}

function get() {
  return cookie.getJSON(authCookie.name);
}

function remove() {
  return cookie.remove(authCookie.name, authCookie.options);
}

export default { save, merge, get, remove };
