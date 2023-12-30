import React, { Component } from "react";
import { Typography, Grid, Box, InputAdornment } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  PrimaryButton,
  Loader,
  Toast,
  SecondaryButton,
  PhoneInputField,
} from "../../../components";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { API, ENDPOINTS } from "../../../../api/apiService";
import ArrowForwardSharpIcon from "@material-ui/icons/ArrowForwardSharp";
import InputFieldHeading from "../../../components/Form/InputFieldHeading";
import GombleLogo from "./GombleCustomerBanner";
import { withRouter } from "react-router";
import { loginSuccess } from "../../../../redux/actions/authActions";
import StorageManager from "../../../../storage/StorageManager";
import { API_TOKEN, LOGOUT_TOKEN } from "../../../../storage/StorageKeys";
import { connect } from "react-redux";
import styles from "../auth.module.css";

class OTPLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resend: false,
      phone: this.props.history.location.state
        ? this.props.history.location.state.phone
        : "",
      country_code: this.props.history.location.state
        ? this.props.history.location.state.country_code.slice(1, 3)
        : "1",
      loading: false,
    };
  }

  handleSentOTP = async (phone, country_code) => {
    this.setState({ loading: true });

    const payload = {
      phone,
      country_code: "+" + country_code,
      resend: this.state.resend,
    };
    if (payload.country_code === "+") {
      Toast.showErrorToast("country code is mandatory");
    }
    if (payload.country_code !== "+") {
      try {
        const resp = await API.post(ENDPOINTS.OTP_LOGIN, payload, false);
        if (resp.success) {
          this.setState({ resend: true });

          const { refresh, access } = resp.data.tokens;
          StorageManager.put(LOGOUT_TOKEN, refresh);
          StorageManager.put(API_TOKEN, access);
          this.props.loginSuccess({
            access,
            refresh,
          });

          Toast.showSuccessToast("OTP sent successfully!");
          this.props.history.push({
            pathname: "/auth/submit-otp",
            state: { detail: payload, page: "otpLogin" },
          });
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
      } finally {
        this.setState({ loading: false });
      }
    } else {
      this.setState({ loading: false });
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
            <Box className={styles.otpContainer}>
              <Grid
                container
                direction="row"
                justify="flex-end"
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
                    wide={true}
                    type="submit"
                    sizeFlag={true} // if size flag be true than fontsize will be 18px if not true than 16px
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
                    {" "}
                    Gomble
                  </span>
                </Typography>
              </Grid>
              <br />
              <Grid item xs={9}>
                <Typography variant="h6">
                  Login into your account with OTP
                </Typography>
              </Grid>
              <div style={{ marginTop: 55 }}>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    phone: this.state.phone,
                    country_code: this.state.country_code,
                  }}
                  validationSchema={Yup.object().shape({
                    phone: Yup.number()
                      .required("Phone Number is required")
                      .test(
                        "is-invalid-number",
                        "Please enter correct phone number",
                        (val) => {
                          if (
                            !isNaN(val) &&
                            Number(val).toString().length > 6 &&  Number(val).toString().length < 16
                          ) {
                            return true;
                          } else {
                            return;
                          }
                        }
                      ),
                  })}
                  onSubmit={({ phone, country_code }) => {
                    this.handleSentOTP(phone, country_code);
                  }}
                >
                  {({
                    handleChange,
                    handleSubmit,
                    handleBlur,
                    values,
                    errors,
                    touched,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <InputFieldHeading label="Phone Number" />
                      <Grid container spacing={2}>
                        <Grid item xs={9} sm={3} md={4} lg={3} xl={3}>
                          <PhoneInput
                            country={"us"}
                            placeholder="Enter country code"
                            onChange={handleChange("country_code")}
                            value={values.country_code}
                            onBlur={handleBlur("country_code")}
                            error={touched.country_code && errors.country_code}
                            helperText={
                              touched.country_code && errors.country_code
                            }
                            countryCodeEditable={false}
                            inputStyle={{
                              border: "1.6px solid #A4B3CC",
                              borderRadius: "6px",
                              fontSize: "15px",
                              width: "100%",
                              height: 60,
                            }}
                            dropdownStyle={{
                              width: "550%",
                            }}
                            buttonStyle={{
                              borderRadius: "6px",
                              border: "1.6px solid #A4B3CC",
                            }}
                          ></PhoneInput>
                        </Grid>
                        <Grid item xs={9} sm={7} md={6} lg={5} xl={5}>
                          <PhoneInputField
                            id="phone"
                            variant="outlined"
                            placeholder="Enter phone number"
                            fullWidth
                            onChange={handleChange("phone")}
                            value={values.phone}
                            onBlur={handleBlur("phone")}
                            error={touched.phone && errors.phone}
                            helperText={touched.phone && errors.phone}
                          />
                        </Grid>
                      </Grid>
                      <PrimaryButton
                        variant="contained"
                        color="primary"
                        style={{ marginTop: 48 }}
                        type="submit"
                        wide={true}
                        sizeFlag={true} // if size flag be true than fontsize will be 18px if not true than 16px
                      >
                        Continue
                        <InputAdornment position="end">
                          <ArrowForwardSharpIcon size="small" />
                        </InputAdornment>
                      </PrimaryButton>
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
)(withRouter(OTPLogin));
