import React from "react";
import { Grid, Typography } from "@material-ui/core";
import SuccessIcon from "../../../assets/icons/success.svg";
import { PrimaryButton } from "../../../components";

const PasswordChanged = ({ onLoginClick }) => {
  return (
    <div>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <img
            style={{ height: "80px", width: "80px" }}
            src={SuccessIcon}
            alt="success"
          />
        </Grid>
        <Grid item>
          <Typography variant="h3" style={{ marginTop: "10px" }}>
            Password changed!
          </Typography>
        </Grid>
        <br />
        <Grid item xs={8}>
          <Typography variant="h5" style={{ marginTop: "10px" }}>
            Your password was succesfully changed. <br />
            You may now login to your account.
          </Typography>
        </Grid>
        <Grid item xs={3} style={{ marginTop: "40px" }}>
          <PrimaryButton wide={true} onClick={onLoginClick}>
            Back to login
          </PrimaryButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default PasswordChanged;
