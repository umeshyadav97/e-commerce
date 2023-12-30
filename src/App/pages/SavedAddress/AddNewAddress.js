/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Grid, Typography, MenuItem, FormHelperText } from "@material-ui/core";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Toast,
  PrimaryButton,
  OutlinedPrimaryButton,
  InputField,
  PhoneInputField,
  Checkbox,
  Dropdown,
} from "../../components";
import { API, ENDPOINTS } from "../../../api/apiService";
import BackButton from "../../assets/icons/back_button.svg";
import { addressConstants } from "./components/AddressConstants";
import styles from "./Address.module.css";
import helpers from "../../../utils/helpers";

const AddNewAddress = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const [sending, setSending] = useState(false);
  const [record, setRecord] = useState(addressConstants.newAddress());
  const [errors, setErrors] = useState(addressConstants.validationRules());
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const handleChange = (key) => (event) => {
    let tempData = { ...record };
    tempData[key] = event.target.value;
    setRecord(tempData);

    if (errors[key] !== undefined) {
      let tempErrors = { ...errors };
      tempErrors[key] = helpers.onChangeValidate(
        tempData[key],
        tempErrors[key]
      );
      setErrors(tempErrors);
    }
  };

  const handleCountryChange = (event) => {
    let tempData = { ...record };
    tempData["country"] = event.target.value;
    tempData["state"] = "-1";
    setRecord(tempData);

    if (errors["country"] !== undefined) {
      let tempErrors = { ...errors };
      tempErrors["country"] = helpers.onChangeValidate(
        tempData["country"],
        tempErrors["country"]
      );
      setErrors(tempErrors);
    }
  };

  const handleCountryCode = (value) => {
    let tempData = { ...record };
    tempData["country_code"] = `+${value}`;
    setRecord(tempData);

    if (errors["country_code"] !== undefined) {
      let tempErrors = { ...errors };
      tempErrors["country_code"] = helpers.onChangeValidate(
        tempData["country_code"],
        tempErrors["country_code"]
      );
      setErrors(tempErrors);
    }
  };

  const handleCheckBox = () => {
    let tempData = { ...record };
    tempData["is_default"] = !tempData["is_default"];
    setRecord(tempData);
  };

  const handleStateChange = async () => {
    try {
      const resp = await API.get(`${record.country}/states/list`);
      if (resp.success) {
        const result = resp.data;
        setStates(result);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching States List. Please Refresh`);
    }
  };

  const fetchCountries = async () => {
    try {
      const resp = await API.get(ENDPOINTS.COUNTRY_LIST);
      if (resp.success) {
        const result = resp.data;
        setCountries(result);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg || `Error Fetching Country List. Please Refresh`
      );
    }
  };

  const handleAddAddress = async () => {
    if (!sending) {
      const { isValid, error } = helpers.validate(record, errors);
      setErrors({ ...error });
      if (isValid) {
        try {
          setSending(true);
          const resp = await API.post(`${ENDPOINTS.SAVED_ADDRESS}`, record);
          if (resp.success) {
            Toast.showSuccessToast(
              resp.data.message || "New Address Added Successfully"
            );
            props.history.push("/saved-address");
          }
        } catch (e) {
          const msg =
            typeof e.data.error?.message === "string"
              ? e.data.error?.message
              : e.data.error?.message[0];
          Toast.showErrorToast(msg || `Error Adding Address`);
          setSending(false);
        }
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCountries();
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (record.country && isLoggedIn) {
      handleStateChange();
    }
  }, [record.country]);

  return (
    <React.Fragment>
      {!isLoggedIn ? <Redirect to="/auth/login" /> : null}
      <Grid container className={styles.address_container}>
        {/* Heading */}
        <Grid container item className={styles.header_box}>
          <Grid container item xs={12} alignItems="center">
            <Grid item>
              <img
                src={BackButton}
                alt="Back"
                className={styles.back_btn}
                onClick={() => props.history.goBack()}
              />
            </Grid>
            <Grid item>
              <Typography variant="h4" className={styles.header}>
                Add Delivery Address
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* Personal Details */}
        <Grid container item xs={12} sm={9} md={8} className={styles.border}>
          {/* Header */}
          <Grid container item className={styles.detailHeader}>
            <Typography variant="h4" className={styles.sideHeader}>
              Personal Details
            </Typography>
          </Grid>
          <Grid container item spacing={4} className={styles.inputContainer}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" className={styles.label}>
                First Name
              </Typography>
              <InputField
                id="first_name"
                type="text"
                placeholder="Enter First Name"
                variant="outlined"
                onChange={handleChange("first_name")}
                value={record.first_name}
                fullWidth
                error={!errors.first_name.valid}
                helperText={
                  !errors.first_name.valid ? errors.first_name.message : " "
                }
              />
            </Grid>
            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" className={styles.label}>
                Last Name
              </Typography>
              <InputField
                id="last_name"
                type="text"
                placeholder="Enter Last Name"
                variant="outlined"
                onChange={handleChange("last_name")}
                value={record.last_name}
                fullWidth
                error={!errors.last_name.valid}
                helperText={
                  !errors.last_name.valid ? errors.last_name.message : " "
                }
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} className={styles.inputContainer}>
            {/* Country Code + Phone No */}
            <Grid item xs={12} sm={9} md={6}>
              <Typography variant="h4" className={styles.label}>
                Phone Number
              </Typography>
              <Grid container spacing={2}>
                {/* Country Code */}
                <Grid item xs={4}>
                  <PhoneInput
                    country={"us"}
                    excludeCountries={["ca", "pr", "do"]}
                    countryCodeEditable={false}
                    enableSearch={true}
                    disableSearchIcon={true}
                    onChange={handleCountryCode}
                    value={record.country_code}
                    error={!errors.country_code.valid}
                    helperText={
                      !errors.country_code.valid
                        ? errors.country_code.message
                        : " "
                    }
                    inputStyle={{
                      border: "1px solid #A4B3CC",
                      borderRadius: "4px",
                      fontSize: "15px",
                      width: "100%",
                      height: 60,
                    }}
                    dropdownStyle={{
                      width: "700%",
                    }}
                    buttonStyle={{
                      borderRadius: "4px",
                      border: "1px solid #A4B3CC",
                    }}
                  />
                </Grid>
                {/* Phone no. */}
                <Grid item xs={8}>
                  <PhoneInputField
                    id="phone"
                    variant="outlined"
                    placeholder="Enter phone number"
                    fullWidth
                    onChange={handleChange("phone")}
                    value={record.phone}
                    error={!errors.phone.valid}
                    helperText={
                      !errors.phone.valid ? errors.phone.message : " "
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Address Details */}
        <Grid container item xs={12} sm={9} md={8} className={styles.border}>
          {/* Header */}
          <Grid container item className={styles.detailHeader}>
            <Typography variant="h4" className={styles.sideHeader}>
              Address Details
            </Typography>
          </Grid>
          <Grid container item spacing={2} className={styles.inputContainer}>
            {/* Country */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" className={styles.label}>
                Country
              </Typography>
              <Dropdown
                variant="outlined"
                labelId="dropdown-label"
                id="country"
                defaultValue="-1"
                fullWidth
                style={{ padding: "2px" }}
                onChange={handleCountryChange}
              >
                <MenuItem value={"-1"}>Select Country</MenuItem>
                {countries.map((countryData) => (
                  <MenuItem key={countryData.name} value={countryData.name}>
                    {countryData.name}
                  </MenuItem>
                ))}
              </Dropdown>
              <FormHelperText className={styles.helper}>
                {!errors.country.valid ? errors.country.message : " "}
              </FormHelperText>
            </Grid>
            {/* State/Province */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" className={styles.label}>
                State/Province
              </Typography>
              <Dropdown
                variant="outlined"
                labelId="dropdown-label"
                id="state"
                value={record.state}
                defaultValue="-1"
                fullWidth
                style={{ padding: "2px" }}
                onChange={handleChange("state")}
              >
                <MenuItem value={"-1"}>Select State</MenuItem>
                {states.map((item) => (
                  <MenuItem key={item.name} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Dropdown>
              <FormHelperText className={styles.helper}>
                {!errors.state.valid ? errors.state.message : " "}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container item spacing={2} className={styles.inputContainer}>
            {/* City */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" className={styles.label}>
                City
              </Typography>
              <InputField
                id="city"
                type="text"
                placeholder="Enter city"
                variant="outlined"
                onChange={handleChange("city")}
                value={record.city}
                fullWidth
                error={!errors.city.valid}
                helperText={!errors.city.valid ? errors.city.message : " "}
              />
            </Grid>
            {/* Zip Code */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" className={styles.label}>
                Zip Code
              </Typography>
              <InputField
                id="zip_code"
                type="text"
                placeholder="Enter Zip Code"
                variant="outlined"
                onChange={handleChange("zip_code")}
                value={record.zip_code}
                fullWidth
                error={!errors.zip_code.valid}
                helperText={
                  !errors.zip_code.valid ? errors.zip_code.message : " "
                }
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} className={styles.inputContainer}>
            {/* Address Line 1 */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" className={styles.label}>
                Address Line 1
              </Typography>
              <InputField
                id="address_one"
                type="text"
                placeholder="Enter your address line 1"
                variant="outlined"
                onChange={handleChange("address_one")}
                value={record.address_one}
                fullWidth
                error={!errors.address_one.valid}
                helperText={
                  !errors.address_one.valid ? errors.address_one.message : " "
                }
              />
            </Grid>
            {/* Address Line 2 */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" className={styles.label}>
                Address Line 2
              </Typography>
              <InputField
                id="address_two"
                type="text"
                placeholder="Enter your address line 2"
                variant="outlined"
                onChange={handleChange("address_two")}
                value={record.address_two}
                fullWidth
              />
            </Grid>
          </Grid>
          {/* Default Checkbox */}
          <Grid container item className={styles.inputContainer}>
            <Grid item>
              <Checkbox isOn={record.is_default} onToggle={handleCheckBox} />
            </Grid>
            <Grid item>
              <Typography variant="h4" className={styles.btnText}>
                Make as default
              </Typography>
            </Grid>
          </Grid>
          {/* Submit Btn */}
          <Grid container item className={styles.inputContainer}>
            <OutlinedPrimaryButton
              isSecondary={true}
              onClick={() => props.history.goBack()}
              className={styles.cancelBtn}
            >
              <Typography variant="h4" className={styles.sideHeader}>
                Cancel
              </Typography>
            </OutlinedPrimaryButton>
            <PrimaryButton
              type="submit"
              onClick={handleAddAddress}
              className={styles.saveAddressBtn}
            >
              <Typography variant="h4" className={styles.sideHeader}>
                Save Address
              </Typography>
            </PrimaryButton>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(AddNewAddress);
