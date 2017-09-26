import cookie from 'js-cookie';
import config from 'src/config/index';

const { name, options } = config.authentication.cookie;

function save(data) {
  cookie.set(name, data, options);
}

function get() {
  return cookie.getJSON(name);
}

function remove() {
  return cookie.remove(name, options);
}

export default { save, get, remove };
