import cookie from 'js-cookie';
import config from '../config';

const { name, options } = config.authentication.cookie;

function save (data) {
  console.log('saving new cookie', JSON.stringify(data, null, 2));
  cookie.set(name, data, options);
}

function get () {
  return cookie.getJSON(name);
}

function remove () {
  return cookie.remove(name, options);
}

export default { save, get, remove };
