import React from 'react';
import { PublicRoute, ProtectedRoute, AuthenticationGate } from 'src/components/auth';
import { Support, GlobalAlertWrapper, BoomerangBanner, SiftScience } from 'src/components';
import GoogleTagManager from 'src/components/googleTagManager/GoogleTagManager';
import Layout from 'src/components/layout/Layout';
import routes from 'src/config/routes';
import config from 'src/config';

import {
  BrowserRouter as Router,
  Redirect,
  Switch
} from 'react-router-dom';

const App = () => (
  <Router>
    <div>
      {config.siftScience && <SiftScience config={config.siftScience} />}
      <BoomerangBanner />
      {config.gtmId && <GoogleTagManager id={config.gtmId} />}
      <AuthenticationGate />
      <Layout>
        <Switch>
          {
            routes.map((route) => {
              const MyRoute = route.public ? PublicRoute : ProtectedRoute;

              route.exact = !(route.exact === false); // this makes exact default to true

              if (route.redirect) {
                return <Redirect key={route.path} exact from={route.path} to={route.redirect} />;
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
);

export default App;
