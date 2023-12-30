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
  PrimaryButton,
  Loader,
  Toast,
  PhoneInputField,
} from "../../../components";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { profileSuccess } from "../../../../redux/actions/authActions";
import StorageManager from "../../../../storage/StorageManager";
import { API_TOKEN, LOGOUT_TOKEN } from "../../../../storage/StorageKeys";
import { API, ENDPOINTS } from "../../../../api/apiService";
import GombleLogo from "./GombleCustomerBanner";
import InputFieldHeading from "../../../components/Form/InputFieldHeading";
import styles from "../auth.module.css";

class CustomerTellUs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      phone: this.props.history.location.state
        ? this.props.history.location.state.phone
        : "",
      country_code: this.props.history.location.state
        ? this.props.history.location.state.country_code.slice(1, 3)
        : "1",
    };
  }

  handleCustomerProfile = async (country_code, phone) => {
    this.setState({ loading: true });
    const payload = {
      country_code: "+" + country_code,
      phone,
    };
    if (payload.country_code === "+") {
      Toast.showErrorToast("country code is mandatory");
    }
    if (payload.country_code !== "+") {
      try {
        const resp = await API.post(ENDPOINTS.CUSTOMER_PHONE, payload, true);
        if (resp.success) {
          const { refresh, access } = resp.data.tokens;
          StorageManager.put(API_TOKEN, access);
          StorageManager.put(LOGOUT_TOKEN, refresh);
          this.props.profileSuccess({
            access,
            refresh,
          });
          Toast.showSuccessToast(resp.data.message);
          this.props.history.push({
            pathname: "/auth/submit-otp",
            state: { detail: payload, page: "customerTellUs" },
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
          Toast.showErrorToast("fill the form correctly");
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
            <Box className={styles.otpSendContainer}>
              <Grid item xs={10}>
                <Typography variant="h3">Verify your phone number </Typography>
              </Grid>
              <br />

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
                          Number(val).toString().length > 6 && Number(val).toString().length < 16
                        ) {
                          return true;
                        } else {
                          return;
                        }
                      }
                    ),
                })}
                onSubmit={({ country_code, phone }) => {
                  this.handleCustomerProfile(country_code, phone);
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  setFieldValue,
                  errors,
                  touched,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <InputFieldHeading label="Phone Number" />
                    <Grid container spacing={2}>
                      <Grid item xs={4} sm={4} md={4}>
                        <PhoneInput
                          country={"us"}
                          placeholder="Enter country code"
                          onChange={handleChange("country_code")}
                          onBlur={handleBlur("country_code")}
                          value={values.country_code}
                          error={touched.country_code && errors.country_code}
                          helperText={
                            touched.country_code && errors.country_code
                          }
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
                      <Grid item xs={7} sm={7} md={6}>
                        <PhoneInputField
                          id="phone"
                          variant="outlined"
                          placeholder="Enter phone number"
                          fullWidth
                          value={values.phone}
                          onChange={handleChange("phone")}
                          onBlur={handleBlur("phone")}
                          error={touched.phone && errors.phone}
                          helperText={touched.phone && errors.phone}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      style={{
                        color: "#708099",
                        marginTop: "6px",
                        marginRight: "16px",
                        fontSize: "16px",
                      }}
                    >
                      <span>
                        OTP will be sent to your number for verification
                      </span>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                      <Grid item>
                        <PrimaryButton
                          variant="outlined"
                          sizeFlag={true}
                          type="submit"
                          wide={true}
                        >
                          Send OTP
                          <InputAdornment position="end">
                            <ArrowForwardSharpIcon size="small" />
                          </InputAdornment>
                        </PrimaryButton>
                      </Grid>
                      <Grid item>
                        <Typography
                          className="cursor-pointer label"
                          variant="h6"
                          style={{ marginTop: "16px", marginLeft: "10px" }}
                        >
                          <span
                            onClick={() => this.props.history.replace("/home")}
                          >
                            <b>Skip </b>
                          </span>
                        </Typography>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
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
  profileSuccess: (data) => dispatch(profileSuccess(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(CustomerTellUs));
