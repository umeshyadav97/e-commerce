import React, { Component } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  PasswordField,
  PrimaryButton,
  Toast,
  SecondaryButton,
  Loader,
} from "../../components";

import { API, ENDPOINTS } from "../../../api/apiService";
import PasswordChanged from "./components/PasswordChanged";
import GombleLogo from "./components/GombleCustomerBanner";
import InputFieldHeading from "../../components/Form/InputFieldHeading";
import styles from "./auth.module.css";

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordVisible: false,
      confirmPasswordVisible: false,
      isPasswordChanged: false,
      slug: this.props.match.params.token,
    };
  }

  togglePasswordVisible = () =>
    this.setState({ passwordVisible: !this.state.passwordVisible });

  toggleConfirmPasswordVisible = () =>
    this.setState({
      confirmPasswordVisible: !this.state.confirmPasswordVisible,
    });

  handleSubmit = async (password, slug) => {
    this.setState({ loading: true });

    const payload = {
      password,
      slug,
    };

    try {
      const resp = await API.patch(ENDPOINTS.RESET_PASSWORD, payload, false);
      if (resp.success) {
        this.setState({ isPasswordChanged: true });
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
        Toast.showErrorToast("Error changing password.");
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { confirmPasswordVisible, isPasswordChanged, loading } = this.state;
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
                justifyContent="flex-end"
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

            {isPasswordChanged ? (
              <div style={{ marginTop: 93 }}>
                <PasswordChanged
                  onLoginClick={() => this.props.history.replace("/auth/login")}
                />
              </div>
            ) : (
              <>
                <Box className={styles.resetContainer}>
                  <Typography variant="h3">Set new password</Typography>
                  <br />
                  <Grid item xs={9} style={{ marginTop: 17 }}>
                    <Typography variant="h6">
                      Please enter and confirm your new password
                    </Typography>
                  </Grid>

                  <div style={{ marginTop: 84 }}>
                    <Formik
                      initialValues={{
                        password: "",
                        passwordConfirmation: "",
                        slug: this.state.slug,
                      }}
                      validationSchema={Yup.object().shape({
                        password: Yup.string()
                          .required("Password is required")
                          .max(25, "Maximum password length is 25 characters")
                          .matches(
                            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                            "Password must contain at least 8 characters, one uppercase, one number and one special case character"
                          ),

                        passwordConfirmation: Yup.string()
                          .oneOf([Yup.ref("password")], "Passwords must match")
                          .required("Confirm password is required"),
                      })}
                      onSubmit={({ password, slug }) => {
                        this.handleSubmit(password, slug);
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
                          <InputFieldHeading label="Password" />
                          <Grid item xs={9}>
                            <PasswordField
                              id="password"
                              placeholder="Enter password"
                              variant="outlined"
                              onChange={handleChange("password")}
                              error={touched.password && errors.password}
                              helperText={touched.password && errors.password}
                              fullWidth
                            />
                          </Grid>
                          <InputFieldHeading label="Confirm Password" />
                          <Grid item xs={9}>
                            <PasswordField
                              id="confirmPassword"
                              placeholder="Re-enter your password"
                              variant="outlined"
                              showPassword={confirmPasswordVisible}
                              togglePassword={this.toggleConfirmPasswordVisible}
                              onChange={handleChange("passwordConfirmation")}
                              error={
                                touched.passwordConfirmation &&
                                errors.passwordConfirmation
                              }
                              helperText={
                                touched.passwordConfirmation &&
                                errors.passwordConfirmation
                              }
                              fullWidth
                            />
                          </Grid>

                          <PrimaryButton
                            variant="contained"
                            color="primary"
                            style={{ marginTop: 56 }}
                            type="submit"
                            wide={true}
                            sizeFlag={true} // if size flag be true than fontsize will be 18px if not true than 16px
                          >
                            Reset password
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

export default ChangePassword;
