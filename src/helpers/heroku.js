import Cookies from 'js-cookie';
import config from 'src/config';
import Boomerang from '@sparkpost/boomerang';
import '@sparkpost/boomerang/boomerang.scss';

const COOKIE_NAME = config.heroku.cookieName;
const OPTIONS = { path: '/', domain: config.website.domain };

/**
 * Tries to load the cookie data from the heroku-nav-data cookie and then adds the heroku bar based on its contents.
 */
function loadHerokuToolbar() {
  const cookieValue = Cookies.get(COOKIE_NAME);

  if (cookieValue) {
    const cookieData = JSON.parse(atob(cookieValue));
    Boomerang.init({
      app: cookieData.appname,
      addon: 'SparkPost',
      user: cookieData.user,
      org: cookieData.org
    });
  }
}

/**
 * Cleans up Heroku resources like cookies and the Boomerang bar
 */
function removeHerokuToolbar() {
  try {
    Cookies.remove(COOKIE_NAME, OPTIONS);

    // window.Boomerang.reset(); // just kidding! this doesn't work! see https://github.com/heroku/boomerang/pull/21
    document.getElementById('heroku-boomerang').remove(); // so we'll do this instead until that PR gets merged
  } catch (e) {
    // silently fail as to not inhibit the logout process
  }
}

export {
  loadHerokuToolbar,
  removeHerokuToolbar
};
