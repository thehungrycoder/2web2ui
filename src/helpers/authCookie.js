import cookie from 'js-cookie';
import config from 'src/config';

const { name, options } = config.authentication.cookie;

function save(data) {
  cookie.set(name, data, options);
}

function merge(data) {
  const merged = Object.assign(get(), data);
  save(merged);
  return merged;
}

function get() {
  return cookie.getJSON(name);
}

function remove() {
  return cookie.remove(name, options);
}

export default { save, merge, get, remove };
