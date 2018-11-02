import React from 'react';
import { PublicRoute, ProtectedRoute, AuthenticationGate, SuspensionAlerts } from 'src/components/auth';
import { CookieConsent, GlobalAlertWrapper, BoomerangBanner, SiftScience } from 'src/components';
import Poll from 'src/context/Poll';
import Support from 'src/components/support/Support';
import GoogleTagManager from 'src/components/googleTagManager/GoogleTagManager';
import Layout from 'src/components/layout/Layout';
import ErrorBoundary from 'src/components/errorBoundaries/ErrorBoundary';
import routes from 'src/config/routes';
import config from 'src/config';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

const App = () => (
  <ErrorBoundary>
    <Poll>
      <Router>
        <div>
          {config.siftScience && <SiftScience config={config.siftScience} />}
          <BoomerangBanner />
          {config.gtmId && <GoogleTagManager id={config.gtmId} />}
          <AuthenticationGate />
          <SuspensionAlerts />
          <CookieConsent />
          <Layout>
            <Switch>
              {
                routes.map((route) => {
                  const MyRoute = route.public ? PublicRoute : ProtectedRoute;

                  route.exact = !(route.exact === false); // this makes exact default to true

                  if (route.redirect) {
                    return (
                      <Route key={route.path} exact path={route.path} render={({ location }) => (
                        <Redirect to={{ ...location, pathname: route.redirect }} />
                      )} />
                    );
                  }

                  return <MyRoute key={route.path} {...route} />;
                })
              }
            </Switch>
          </Layout>
          <Support />
          <GlobalAlertWrapper />
        </div>
      </Router>
    </Poll>
  </ErrorBoundary>
);

export default App;
