import Cookies from 'js-cookie';
import config from 'src/config';
import ErrorTracker from 'src/helpers/errorTracker';
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

    Boomerang.reset();
  } catch (error) {
    ErrorTracker.report('remove-heroku-toolbar', error);
    // do not rethrow as to not inhibit the logout process
  }
}

export {
  loadHerokuToolbar,
  removeHerokuToolbar
};
