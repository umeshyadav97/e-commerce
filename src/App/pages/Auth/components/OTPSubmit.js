import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Typography,
  Grid,
  Box,
  InputAdornment,
  withTheme,
} from "@material-ui/core";
import { Formik } from "formik";
import { InputField, PrimaryButton, Loader, Toast } from "../../../components";
import { API, ENDPOINTS } from "../../../../api/apiService";
import ArrowForwardSharpIcon from "@material-ui/icons/ArrowForwardSharp";
import InputFieldHeading from "../../../components/Form/InputFieldHeading";
import GombleLogo from "./GombleCustomerBanner";
import StorageManager from "../../../../storage/StorageManager";
import { API_TOKEN, LOGOUT_TOKEN } from "../../../../storage/StorageKeys";
import { loginSuccess } from "../../../../redux/actions/authActions";
import { askForPermissioToReceiveNotifications } from "../../../../pushNotification";
import styles from "../auth.module.css";
import { setSession } from "../../../components/Layout/sessionStorage";

class OTPSubmit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: this.props.history.location.state.detail.phone,
      country_code: this.props.history.location.state.detail.country_code,
      resend: true,
      loading: false,
      resendFlag: false,
      apnToken: "",
    };
  }

  handleSafariNotification = (token) => {
    this.setState({ apnToken: token });
  };

  componentDidMount() {
    this.startTimer(30);
  }

  startTimer(duration) {
    var timer = duration,
      seconds;
    this.interval = setInterval(function () {
      seconds = parseInt(timer % 60, 10);
      seconds = seconds < 10 ? "0" + seconds : seconds;
      if (document.getElementById("time")) {
        document.getElementById("time").innerHTML = seconds + " s";
      }

      if (--timer < 0) {
        timer = 30;
      }
    }, 1000);
    setTimeout(() => {
      this.setState({ resendFlag: true });
    }, 30000);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.timeLeft === 1) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.setState({ resendFlag: false });
  }
  handleSentOTP = async () => {
    clearInterval(this.interval);
    this.startTimer(30);
    this.setState({ loading: true });
    this.setState({ resendFlag: false });
    const payload = {
      phone: this.state.phone,
      country_code: this.state.country_code,
      resend: this.state.resend,
    };
    try {
      const endPoint =
        this.props.history.location.state.page === "otpLogin"
          ? await API.post(ENDPOINTS.OTP_LOGIN, payload, false)
          : await API.post(ENDPOINTS.CUSTOMER_PHONE, payload, true);
      const resp = endPoint;
      if (resp.success) {
        const { refresh, access } = resp.data.tokens;
        StorageManager.put(LOGOUT_TOKEN, refresh);
        StorageManager.put(API_TOKEN, access);
        this.props.loginSuccess({
          access,
          refresh,
        });

        Toast.showSuccessToast("OTP sent successfully!");
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
        Toast.showErrorToast("Error sending OTP");
      }
    }
  };

  handleSentResetLink = async (otpCode) => {
    let payload = {};
    if (this.props.history.location.state.page === "otpLogin") {
      payload = {
        otpCode,
        phone: this.state.phone,
        country_code: this.state.country_code,
      };

      if (window.safari && window.safari.pushNotification) {
        let permissionData = window.safari.pushNotification.permission(
          "web.com.designer.gomble"
        );
        // eslint-disable-next-line no-unused-vars
        let deviceToken = await this.checkRemotePermission(permissionData);
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
    } else if (this.props.history.location.state.page === "customerTellUs") {
      payload = {
        otp_code: otpCode,
        phone: this.state.phone,
        country_code: this.state.country_code,
      };
    }

    if (otpCode === "" || otpCode == null) {
      Toast.showErrorToast("OTP required");
    } else {
      this.setState({ loading: true });
      try {
        const endPoint =
          this.props.history.location.state.page === "otpLogin"
            ? await API.post(ENDPOINTS.VERIFY_OTP, payload, true)
            : await API.patch(ENDPOINTS.UPDATE_PHONE, payload, true);
        const resp = endPoint;
        if (resp.success) {
          const { refresh, access } = resp.data.tokens;
          StorageManager.put(LOGOUT_TOKEN, refresh);
          StorageManager.put(API_TOKEN, access);
          localStorage.setItem("social_signup", resp?.data?.social_signup);
          this.props.loginSuccess({
            access,
            refresh,
          });
          localStorage.getItem("path_name")
            ? this.props.history.replace(`${localStorage.getItem("path_name")}`)
            : this.props.history.replace("/home");
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
          Toast.showErrorToast("Error in submitting OTP.");
        }
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  handleEditNumber = () => {
    if (this.props.history.location.state.page === "otpLogin") {
      this.props.history.push({
        pathname: "/auth/otp-login",
        state: {
          phone: this.state.phone,
          country_code: this.state.country_code,
        },
      });
    } else if (this.props.history.location.state.page === "customerTellUs") {
      this.props.history.push({
        pathname: "/auth/customer-tell-us-about",
        state: {
          phone: this.state.phone,
          country_code: this.state.country_code,
        },
      });
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
    return (
      <React.Fragment>
        {this.loading && <Loader />}
        <Grid container style={{ height: "100vh" }}>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            style={{ backgroundColor: "#FFD5DA" }}
          >
            <GombleLogo />
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            style={{ background: "white" }}
          >
            <Box className={styles.otpSubmitContainer}>
              <br />
              <Typography
                style={{
                  marginTop: "14px",
                  fontWeight: 600,
                  fontSize: "32px",
                }}
              >
                Enter OTP
              </Typography>
              <br />
              <Grid item xs={9}>
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  Please verify your phone number {this.state.country_code}-
                  {this.state.phone} to login into your account
                </span>
              </Grid>
              <br />
              <Typography variant="h6" style={{ marginTop: "6px" }}>
                <span>Wrong Number?</span>
                <span
                  className="cursor-pointer label"
                  onClick={this.handleEditNumber}
                  style={{ color: "#FC68A2" }}
                >
                  {" "}
                  Edit your phone number{" "}
                </span>
              </Typography>
              <div style={{ marginTop: 55 }}>
                <Formik
                  initialValues={{ otpCode: "" }}
                  onSubmit={({ otpCode }) => {
                    this.handleSentResetLink(otpCode);
                  }}
                >
                  {({
                    handleChange,
                    handleSubmit,
                    handleBlur,
                    errors,
                    touched,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <InputFieldHeading label="OTP" />
                      <Grid item xs={9}>
                        <InputField
                          id="otp"
                          type="number"
                          placeholder="Enter OTP"
                          true
                          variant="outlined"
                          onWheel={(e) => e.target.blur()}
                          onChange={handleChange("otpCode")}
                          onBlur={handleBlur("otpCode")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={9}>
                        {this.state.resendFlag ? (
                          <Grid container justify="flex-end">
                            <span
                              style={{
                                fontFamily: "Inter",
                                fontSize: "14",
                                fontWeight: 600,
                                cursor: "pointer",
                                marginTop: "6px",
                              }}
                              onClick={this.handleSentOTP}
                            >
                              Resend OTP
                            </span>
                          </Grid>
                        ) : (
                          <Grid container justify="flex-end">
                            <span
                              style={{
                                color: "#A4B3CC",
                                fontFamily: "Inter",
                                fontSize: "14",
                                marginTop: "6px",
                              }}
                            >
                              Resend OTP in <span id="time"> 00 s </span>
                            </span>
                          </Grid>
                        )}
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: "24px" }}>
                        <Grid item>
                          <PrimaryButton
                            variant="contained"
                            color="primary"
                            type="submit"
                            wide={true}
                            sizeFlag={true} // if size flag be true than fontsize will be 18px if not true than 16px
                          >
                            Confirm
                            <InputAdornment position="end">
                              <ArrowForwardSharpIcon size="small" />
                            </InputAdornment>
                          </PrimaryButton>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Formik>
              </div>
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  loginSuccess: (data) => dispatch(loginSuccess(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(OTPSubmit));
