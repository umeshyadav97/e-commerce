import React, { Component } from "react";
import { Typography, Grid, Box, InputAdornment } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  InputField,
  PrimaryButton,
  Loader,
  Toast,
  SecondaryButton,
} from "../../components";

import { API, ENDPOINTS } from "../../../api/apiService";
import ArrowForwardSharpIcon from "@material-ui/icons/ArrowForwardSharp";

import EmailSent from "./components/EmailSent";
import InputFieldHeading from "../../components/Form/InputFieldHeading";
import GombleLogo from "./components/GombleCustomerBanner";
import styles from "./auth.module.css";

class ResetPassword extends Component {
  constructor() {
    super();

    this.state = {
      emailSent: false,
      storedEmail: "",
      loading: false,
    };
  }

  handleSentResetLink = async (email, isResend) => {
    this.setState({ loading: true });

    const payload = {
      email,
      user_type: "CUSTOMER",
    };

    try {
      const resp = await API.post(ENDPOINTS.FORGOT_PASSWORD, payload, false);
      if (resp.success) {
        this.setState({ emailSent: true, storedEmail: email });
        if (isResend === true) {
          Toast.showSuccessToast("Email resent successfully!");
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
        Toast.showErrorToast("Error sending password reset link.");
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { emailSent, storedEmail, loading } = this.state;
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
            <Box className={styles.resetContainer}>
              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
                spacing={3}
                style={{ paddingTop: "21px", paddingRight: "40px" }}
              >
                <Grid item>
                  <span>Already a member?</span>
                </Grid>
                <Grid item>
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
              </Grid>
            </Box>

            {emailSent ? (
              <div style={{ marginTop: 93 }}>
                <EmailSent
                  onResend={() => this.handleSentResetLink(storedEmail, true)}
                  onLoginClick={() => this.props.history.replace("/auth/login")}
                />
              </div>
            ) : (
              <>
                <Box className={styles.resetContainer}>
                  <Typography variant="h3" style={{ marginTop: 39 }}>
                    Forgot <span style={{ color: "#FC68A2" }}> password?</span>
                  </Typography>
                  <br />
                  <Grid item xs={9}>
                    <Typography variant="h6">
                      Enter your email address you're using for your account
                      below and we'll send you a password reset link.
                    </Typography>
                  </Grid>
                  <div style={{ marginTop: 55 }}>
                    <Formik
                      initialValues={{ email: "" }}
                      validationSchema={Yup.object().shape({
                        email: Yup.string()
                          .email("Wrong email format!")
                          .required("Email is required"),
                      })}
                      onSubmit={({ email, user_type }) => {
                        this.handleSentResetLink(email, user_type);
                      }}
                    >
                      {({
                        handleChange,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                      }) => (
                        <form onSubmit={handleSubmit}>
                          <InputFieldHeading label="Enter Email" />
                          <Grid item xs={9}>
                            <InputField
                              id="email"
                              type="text"
                              placeholder="Enter email address"
                              variant="outlined"
                              onChange={handleChange("email")}
                              error={touched.email && errors.email}
                              helperText={
                                touched.email && errors.email && errors.email
                              }
                              fullWidth
                            />
                          </Grid>

                          <PrimaryButton
                            variant="contained"
                            color="primary"
                            style={{ marginTop: 48 }}
                            type="submit"
                            wide = {true}
                            sizeFlag={true} // if size flag be true than fontsize will be 18px if not true than 16px
                          >
                            Send
                            <InputAdornment position="end">
                              <ArrowForwardSharpIcon size="small" />
                            </InputAdornment>
                          </PrimaryButton>
                        </form>
                      )}
                    </Formik>
                  </div>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ResetPassword;
