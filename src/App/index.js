import React, { Component, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loadable from "react-loadable";
import { ThemeProvider } from "@material-ui/core/styles";
import { getNotification } from "../redux/actions/authActions";
import { API } from "../api/apiService";
import StorageManager from "../storage/StorageManager";
import { API_TOKEN } from "../storage/StorageKeys";
import Loader from "../App/components/Loader";
import AuthWrapper from "../hoc/AuthWrapper";
import { Toast } from "./components";
import publicRoutes from "./publicRoutes";
import preloadImages from "./assets/preloadImages";
import { onMessageListener } from "../firebaseOpenNotification";
import "react-toastify/dist/ReactToastify.css";
import "./theme/index.scss";
import PrivateRoutes from "./privateRoutes";
import theme from "./theme/appTheme";
import { connect } from "react-redux";
import ErrorPage from "./components/ErrorPage";

const Layout = Loadable({
  loader: () => import("./layout"),
  loading: Loader,
});

const Router = () => {
  const authPages = publicRoutes.map((route, index) => {
    return route.component ? (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        component={route.component}
      />
    ) : null;
  });

  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Redirect exact from="/" to="/home" />
        {authPages}
        {PrivateRoutes.map((route) => (
          <AuthWrapper
            key={`Route-${route.path}`}
            {...route}
            component={Layout}
          />
        ))}
        <Route exact path="*" component={ErrorPage} />
      </Switch>
    </Suspense>
  );
};

class App extends Component {
  componentDidMount() {
    preloadImages();
    const authToken = StorageManager.get(API_TOKEN);
    if (authToken) {
      onMessageListener()
        .then((payload) => {
          API.get("/notification/logs", true)
            .then((response) => {
              this.props.getNotification({
                data: response?.data?.unread_count,
              });
            })
            .catch(() => {});
          Toast.showSuccessToast(payload.notification.body);
        })
        .catch((err) => {
          console.log(err);
        });
      API.get("/notification/logs", true)
        .then((response) => {
          this.props.getNotification({
            data: response?.data?.unread_count,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getNotification: (data) => dispatch(getNotification(data)),
});

export default connect(null, mapDispatchToProps)(App);
