import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { API, ENDPOINTS } from "../../../api/apiService";
import { logout } from "../../../redux/actions/authActions";
import { Breadcrumbs, Grid, Typography } from "@material-ui/core";
import { Toast, PrimaryButton, PasswordField } from "../../components";
import { passwordConstants } from "./PasswordConstants";
import helpers from "../../../utils/helpers";
import styles from "./ChangePassword.module.css";
import Link from "@material-ui/core/Link";

const ChangePassword = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const history = useHistory();
  const [updating, setUpdating] = useState(false);
  const [record, setRecord] = useState(passwordConstants.newPassword());
  const [errors, setErrors] = useState(passwordConstants.validationRules());

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
      if (key === "confirm_password" && tempData[key].length > 0) {
        if (tempData[key] !== record.new_password) {
          tempErrors[key].valid = false;
          tempErrors[key].message =
            "The password and confirmation password do not match";
        } else {
          tempErrors[key].valid = true;
          tempErrors[key].message = "";
        }
      }
      setErrors(tempErrors);
    }
  };

  const handleChangePassword = async () => {
    if (!updating) {
      const { isValid, error } = helpers.validate(record, errors);
      setErrors({ ...error });
      if (isValid) {
        if (record.new_password !== record.confirm_password) {
          Toast.showErrorToast(`New Password & Confirm Password doesn't match`);
          return;
        }
        try {
          setUpdating(true);
          const payload = {
            current_password: record.current_password,
            new_password: record.new_password,
          };
          const resp = await API.patch(`${ENDPOINTS.CHANGE_PASSWORD}`, payload);
          if (resp.success) {
            Toast.showSuccessToast(`Password Changed Successfully`);
            localStorage.clear();
            history.replace("/auth/login");
          }
        } catch (e) {
          const msg =
            typeof e.data.error?.message === "string"
              ? e.data.error?.message
              : e.data.error?.message[0];
          Toast.showErrorToast(msg || `Error Updating Password`);
          setUpdating(false);
        }
      }
    }
  };

  return (
    <React.Fragment>
      {!isLoggedIn ? <Redirect to="/auth/login" /> : null}
      <Grid className={styles.container}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/home">
            <Typography className={styles.Link}>Home</Typography>
          </Link>
          <Link color="inherit">
            <Typography className={styles.Link}>Change Password</Typography>
          </Link>
        </Breadcrumbs>
        {/* Heading */}
        <Grid container item>
          <Grid
            item
            xs={12}
            sm={10}
            md={7}
            lg={5}
            className={styles.header_border}
          >
            <Typography className={styles.header}>Change Password</Typography>
          </Grid>
        </Grid>
        <Grid container direction="column" className={styles.form_container}>
          {/* Current Password */}
          <Grid item sm={12}>
            <Typography className={styles.label}>Current Password</Typography>
            <PasswordField
              id="first_name"
              placeholder="Enter Current Password"
              variant="outlined"
              onChange={handleChange("current_password")}
              value={record.current_password}
              fullWidth
              error={!errors.current_password.valid}
              helperText={
                !errors.current_password.valid
                  ? errors.current_password.message
                  : " "
              }
            />
          </Grid>
          {/* New Password */}
          <Grid item>
            <Typography className={styles.label}>New Password</Typography>
            <PasswordField
              id="first_name"
              placeholder="Enter New Password"
              variant="outlined"
              onChange={handleChange("new_password")}
              value={record.new_password}
              fullWidth
              error={!errors.new_password.valid}
              helperText={
                !errors.new_password.valid ? errors.new_password.message : " "
              }
            />
          </Grid>
          {/* Confirm Password */}
          <Grid item>
            <Typography className={styles.label}>Confirm Password</Typography>
            <PasswordField
              id="password"
              placeholder="Enter Confirm Password"
              variant="outlined"
              onChange={handleChange("confirm_password")}
              value={record.confirm_password}
              fullWidth
              error={!errors.confirm_password.valid}
              helperText={
                !errors.confirm_password.valid
                  ? errors.confirm_password.message
                  : " "
              }
            />
          </Grid>
          {/* Submit Button */}
          <Grid item>
            <PrimaryButton
              type="submit"
              onClick={handleChangePassword}
              className={styles.submitBtn}
              wide
            >
              <Typography variant="h4" className={styles.btnText}>
                Save
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

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
