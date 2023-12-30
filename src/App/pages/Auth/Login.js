import React, { Component } from "react";
import {
  Box,
  Grid,
  InputAdornment,
  Typography,
  withTheme,
} from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import ArrowForwardSharpIcon from "@material-ui/icons/ArrowForwardSharp";
import {
  InputField,
  PasswordField,
  PrimaryButton,
  Loader,
  Toast,
  SecondaryButton,
} from "../../components";

import {
  loginSuccess,
  setCart,
  getNotification,
} from "../../../redux/actions/authActions";
import StorageManager from "../../../storage/StorageManager";
import { API_TOKEN, LOGOUT_TOKEN, VALIDITY_DATE } from "../../../storage/StorageKeys";
import { API, ENDPOINTS } from "../../../api/apiService";
import InputFieldHeading from "../../components/Form/InputFieldHeading";
import SignUpWith from "./components/SignUpWith";
import GombleLogo from "./components/GombleCustomerBanner";
import { askForPermissioToReceiveNotifications } from "../../../pushNotification";
import styles from "./auth.module.css";
import { setSession } from "../../components/Layout/sessionStorage";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      apnToken: "",
    };
  }

  handleSafariNotification = (token) => {
    this.setState({ apnToken: token });
  };

  handleLogin = async (email, password) => {
    this.setState({ loading: true });
    const payload = {
      email,
      password,
    };
    if (window.safari && window.safari.pushNotification) {
      let permissionData = window.safari.pushNotification.permission(
        "web.com.designer.gomble"
      );
      await this.checkRemotePermission(permissionData);
    } else {
      let deviceToken = await askForPermissioToReceiveNotifications();
      if (deviceToken) {
        payload.device = {
          device_token: deviceToken,
          device_type: "WEB",
          is_safari: false,
        };
      }
    }
    try {
      const resp = await API.post(ENDPOINTS.LOGIN, payload, false);
      if (resp.success) {
        const count = resp.data?.cart_count;
        this.props.setCart(count);
        const { refresh, access } = resp.data.tokens;
        StorageManager.put(LOGOUT_TOKEN, refresh);
        StorageManager.put(API_TOKEN, access);
        const today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        StorageManager.put(VALIDITY_DATE, tomorrow);
        this.props.loginSuccess({
          access,
          refresh,
        });
        localStorage.setItem("social_signup", resp.data.social_signup);
        localStorage.getItem("path_name")
          ? this.props.history.replace(`${localStorage.getItem("path_name")}`)
          : this.props.history.replace("/home");
        const respNotification = await API.get(ENDPOINTS.NOTIFICATION);
        if (respNotification?.success) {
          this.props.getNotification({
            data: respNotification?.data?.unread_count,
          });
        }
      }
    } catch (e) {
      if (e.data.error) {
        if (
          Array.isArray(e.data.error.message) &&
          e.data.error.message.length > 0
        ) {
          Toast.showErrorToast(e.data.error.message[0]);
        }
      } else {
        Toast.showErrorToast("Incorrect email or password");
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  checkRemotePermission = (permissionData) => {
    if (permissionData.permission === "default") {
      window.safari.pushNotification.requestPermission(
        process.env.REACT_APP_API_Endpoint,
        "web.com.designer.gomble",
        { panel: "gomble" },
        this.checkRemotePermission
      );
    } else if (permissionData.permission === "denied") {
      console.log("DENIED");
      console.log(permissionData);
      // The user said no.
    } else if (permissionData.permission === "granted") {
      console.log("GRANTED", permissionData);
      setSession("device-token", permissionData.deviceToken);
      return permissionData.deviceToken;
      // The web service URL is a valid push provider, and the user said yes.
      // permissionData.deviceToken is now available to use.
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <React.Fragment>
        {loading && <Loader />}
        <Grid container style={{ height: "100vh" }}>
          <Grid
            item
            xs={12}
            sm={5}
            md={6}
            lg={6}
            style={{ backgroundColor: "#FFD5DA" }}
          >
            <GombleLogo />
          </Grid>

          <Grid
            item
            xs={12}
            sm={7}
            md={6}
            lg={6}
            style={{ background: "white" }}
          >
            <Box className={styles.rightContainer}>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                style={{ paddingTop: "21px", paddingRight: "40px" }}
              >
                <Grid item xs={8} lg={4}>
                  <span>Are you a new member?</span>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <SecondaryButton
                    onClick={() =>
                      this.props.history.push("/auth/customer-signup")
                    }
                    variant="outlined"
                    wide="true"
                    type="submit"
                  >
                    Sign Up
                  </SecondaryButton>
                </Grid>
              </Grid>
              <br />
              <Grid item xs={12}>
                <Typography variant="h3">
                  Welcome to{" "}
                  <span
                    style={{ color: "#FC68A2", cursor: "pointer" }}
                    onClick={() => this.props.history.push("/home")}
                  >
                    Gomble{" "}
                  </span>
                </Typography>
              </Grid>
              <br />
              <Typography variant="h6">
                Log into your account to continue.
              </Typography>
              <br />
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email("Wrong email format!")
                    .required("Email is required"),
                  password: Yup.string()
                    .required("Password is required")
                    .min(8, "Minimun password length is 8 characters"),
                })}
                onSubmit={({ email, password }) => {
                  this.handleLogin(email, password);
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  errors,
                  touched,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <InputFieldHeading label="Email Address" />
                    <Grid item xs={9}>
                      <InputField
                        id="email"
                        type="text"
                        placeholder="Enter email address"
                        variant="outlined"
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                        error={touched.email && errors.email}
                        helperText={touched.email && errors.email}
                        fullWidth
                      />
                    </Grid>
                    <InputFieldHeading label="Password" />
                    <Grid item xs={9}>
                      <PasswordField
                        id="password"
                        placeholder="Enter password"
                        variant="outlined"
                        onChange={handleChange("password")}
                        onBlur={handleBlur("password")}
                        error={touched.password && errors.password}
                        helperText={touched.password && errors.password}
                        fullWidth
                      />
                    </Grid>

                    <Typography
                      className="cursor-pointer label"
                      variant="h6"
                      style={{ marginTop: "6px" }}
                    >
                      <span
                        onClick={() =>
                          this.props.history.push("/auth/reset-password")
                        }
                      >
                        Forgot Password?
                      </span>
                      <span
                        onClick={() =>
                          this.props.history.push("/auth/otp-login")
                        }
                        style={{ color: "#FC68A2" }}
                      >
                        {" "}
                        Login with OTP{" "}
                      </span>
                    </Typography>
                    <br />
                    <br />
                    <PrimaryButton type="submit" wide="true">
                      Login
                      <InputAdornment position="end">
                        <ArrowForwardSharpIcon size="small" />
                      </InputAdornment>
                    </PrimaryButton>
                  </form>
                )}
              </Formik>
              <br />
            </Box>
            <SignUpWith />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loginSuccess: (data) => dispatch(loginSuccess(data)),
    setCart: (count) => dispatch(setCart(count)),
    getNotification: (data) => dispatch(getNotification(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Login));
