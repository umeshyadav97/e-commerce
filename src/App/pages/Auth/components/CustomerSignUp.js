import React, { Component } from "react";
import {
  Box,
  Grid,
  InputAdornment,
  Typography,
  withTheme,
} from "@material-ui/core";
import { Formik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import ArrowForwardSharpIcon from "@material-ui/icons/ArrowForwardSharp";

import {
  InputField,
  PrimaryButton,
  Loader,
  Toast,
  SecondaryButton,
  PasswordField,
  Switch,
} from "../../../components";
import { API, ENDPOINTS } from "../../../../api/apiService";
import GombleLogo from "./GombleCustomerBanner";
import InputFieldHeading from "../../../components/Form/InputFieldHeading";
import SignUpWith from "./SignUpWith";
import { signupSuccess } from "../../../../redux/actions/authActions";
import StorageManager from "../../../../storage/StorageManager";
import { API_TOKEN, LOGOUT_TOKEN } from "../../../../storage/StorageKeys";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { askForPermissioToReceiveNotifications } from "../../../../pushNotification";
import styles from "../auth.module.css";
import { setSession } from "../../../components/Layout/sessionStorage";

class CustomerSignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      termsFlag: false,
      value: "male",
      apnToken: "",
    };
  }

  handleSafariNotification = (token) => {
    this.setState({ apnToken: token });
  };

  handleSwitchOn = () => {
    this.setState({ termsFlag: true });
  };

  handleSwitchOff = () => {
    this.setState({ termsFlag: false });
  };

  handleGenderChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleSignup = async (first_name, last_name, email, password) => {
    const payload = {
      first_name,
      last_name,
      email,
      password,
      gender: this.state.value,
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

    if (this.state.termsFlag === false) {
      Toast.showErrorToast(
        "Please accept the Terms and Conditions and the Privacy Policy"
      );
    } else if (this.state.termsFlag === true) {
      try {
        this.setState({ loading: true });
        const resp = await API.post(ENDPOINTS.SIGNUP, payload, false);
        if (resp.success) {
          localStorage.setItem("social_signup", resp.data.social_signup);
          const { refresh, access } = resp.data.tokens;
          StorageManager.put(LOGOUT_TOKEN, refresh);
          StorageManager.put(API_TOKEN, access);
          this.props.signupSuccess({
            access,
            refresh,
          });
          Toast.showSuccessToast("email registered successfully");
          this.props.history.push("/auth/customer-tell-us-about");
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
          Toast.showErrorToast("Error in sign up,please reload the page");
        }
      } finally {
        this.setState({ loading: false });
      }
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
            <Box className={styles.signupContainer}>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={3}
                style={{ paddingTop: "21px", paddingRight: "40px" }}
              >
                <Grid item xs={8} lg={4}>
                  <span>Already a member?</span>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <SecondaryButton
                    onClick={() => this.props.history.push("/auth/login")}
                    variant="outlined"
                    wide={true}
                    sizeFlag={true} // if size flag be true than fontsize will be 18px if not true than 16px
                    type="submit"
                  >
                    Login
                  </SecondaryButton>
                </Grid>
              </Grid>{" "}
              <br />
              <Grid item xs={12}>
                <Typography variant="h3">
                  Sign Up to{" "}
                  <span
                    style={{ color: "#FC68A2", cursor: "pointer" }}
                    onClick={() => this.props.history.push("/home")}
                  >
                    Gomble{" "}
                  </span>
                </Typography>
              </Grid>
              <br />
              <Formik
                initialValues={{
                  first_name: "",
                  last_name: "",
                  gender: this.state.value,
                  email: "",
                  password: "",
                  confirm_password: "",
                }}
                validationSchema={Yup.object().shape({
                  first_name: Yup.string()
                    .required("First name is required")
                    .test(
                      "first_name",
                      "First Name must only contain alphabets",
                      (value) => {
                        return /^[A-Za-z ]+$/.test(value);
                      }
                    ),
                  last_name: Yup.string()
                    .required("Last name is required")
                    .test(
                      "last_name",
                      "Last Name must only contain alphabets",
                      (value) => {
                        return /^[A-Za-z ]+$/.test(value);
                      }
                    ),
                  email: Yup.string()
                    .email("Wrong email format!")
                    .required("Email is required"),
                  password: Yup.string()
                    .required("Password is required")
                    .max(25, "Maximum password length is 25 characters")
                    .matches(
                      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
                    ),

                  confirm_password: Yup.string()
                    .required("Confirm password is required")
                    .oneOf(
                      [Yup.ref("password"), null],
                      "Password does not match"
                    ),
                })}
                onSubmit={({ first_name, last_name, email, password }) => {
                  this.handleSignup(first_name, last_name, email, password);
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid item xs={9}>
                      <InputFieldHeading label="Gender" />
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          aria-label="gender"
                          name="gender"
                          value={this.state.value}
                          onChange={this.handleGenderChange}
                        >
                          <FormControlLabel
                            value="male"
                            control={<Radio />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="female"
                            control={<Radio />}
                            label="Female"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <InputFieldHeading label="First Name" />
                    <Grid item xs={9}>
                      <InputField
                        id="firstname"
                        type="text"
                        placeholder="Enter first name "
                        variant="outlined"
                        onChange={handleChange("first_name")}
                        onBlur={handleBlur("first_name")}
                        error={touched.first_name && errors.first_name}
                        helperText={touched.first_name && errors.first_name}
                        fullWidth
                      />
                    </Grid>
                    <InputFieldHeading label="Last Name" />
                    <Grid item xs={9}>
                      <InputField
                        id="lastname"
                        type="text"
                        placeholder="Enter last name "
                        variant="outlined"
                        onChange={handleChange("last_name")}
                        onBlur={handleBlur("last_name")}
                        error={touched.last_name && errors.last_name}
                        helperText={touched.last_name && errors.last_name}
                        fullWidth
                      />
                    </Grid>

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
                    <Grid Item xs={9}>
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
                    <InputFieldHeading label="Confirm Password" />

                    <Grid Item xs={9}>
                      <PasswordField
                        id="confirm_password"
                        placeholder="Re-enter password"
                        variant="outlined"
                        onChange={handleChange("confirm_password")}
                        onBlur={handleBlur("confirm_password")}
                        error={
                          touched.confirm_password && errors.confirm_password
                        }
                        helperText={
                          touched.confirm_password && errors.confirm_password
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Switch
                        switchOnClick={() => this.handleSwitchOn()}
                        switchOffClick={() => this.handleSwitchOff()}
                        label1="By signing up you agree to the"
                        label2=" Terms and Conditions"
                        label3=" and the"
                        label4=" Privacy Policy"
                      />
                    </Grid>
                    <br />
                    <PrimaryButton
                      variant="outlined"
                      sizeFlag={true} // if size flag be true than fontsize will be 18px if not true than 16px
                      type="submit"
                      wide={true}
                    >
                      Continue
                      <InputAdornment position="end">
                        <ArrowForwardSharpIcon size="small" />
                      </InputAdornment>
                    </PrimaryButton>
                  </form>
                )}
              </Formik>
            </Box>
            <br />
            <Box className={styles.signupContainer}>
              <SignUpWith />
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
  signupSuccess: (data) => dispatch(signupSuccess(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(CustomerSignUp));
