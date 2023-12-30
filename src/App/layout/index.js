import React, { Component, Suspense } from "react";
import { Route, Switch } from "react-router-dom";

import Loader from "../components/Loader";
import AppContainer from "./AppContainer";
import routes from "../privateRoutes";

class Layout extends Component {
  render() {
    const menu = routes.map((route, index) => {
      return route.component ? (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          render={(props) => {
            return <route.component {...props} />;
          }}
        />
      ) : null;
    });

    return (
      <AppContainer>
        <Suspense fallback={<Loader />}>
          <Switch>{menu}</Switch>
        </Suspense>
      </AppContainer>
    );
  }
}

export default Layout;
