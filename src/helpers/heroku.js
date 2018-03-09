import Cookies from 'js-cookie';
import config from 'src/config';

const COOKIE_NAME = config.heroku.cookieName;
// const OPTIONS = { path: '/', domain: config.website.domain };

/**
 * Tries to load the cookie data from the heroku-nav-data cookie and then adds the heroku bar based on its contents.
 *
 * @return(boolean) true if the bar was loaded so that styles can be added
 */
function barMe() {
  // bail if the script hasn't loaded yet
  if (!window.Boomerang) {
    return false;
  }

  const cookieValue = Cookies.get(COOKIE_NAME);

  if (cookieValue) {
    try {
      const cookieData = JSON.parse(atob(cookieValue));
      window.Boomerang.init({
        app: cookieData.appname,
        addon: 'SparkPost',
        user: cookieData.user,
        org: cookieData.org
      });

      return true;
    } catch (e) {
      // silently fail
    }
  }
  return false;
}

/**
 * Cleans up Heroku resources like cookies and the Boomerang bar
 */
function unbar() {
  try {
    Cookies.remove(COOKIE_NAME);

    // window.Boomerang.reset(); // just kidding! this doesn't work! see https://github.com/heroku/boomerang/pull/21
    document.getElementById('heroku-boomerang').remove(); // so we'll do this instead until that PR gets merged
  } catch (e) {
    // silently fail as to not inhibit the logout process
  }
}

export {
  barMe,
  unbar
};
