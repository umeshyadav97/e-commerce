import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { PrimaryButton } from "../../../components";
import EmailIcon from "../../../assets/icons/email.svg";

const EmailSent = ({ onResend, onLoginClick }) => {
  return (
    <div>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <img src={EmailIcon} alt="email" />
        </Grid>
        <Grid item>
          <Typography variant="h3" style={{ marginTop: 20 }}>
            Email sent!
          </Typography>
        </Grid>
        <br />
        <Grid item xs={8}>
          <span className="text-muted p2" style={{ marginTop: 23 }}>
            Please check your email inbox. You will receive an email with
            instructions on how to reset your password soon.
          </span>
        </Grid>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="row"
          spacing={3}
          justify="center"
          style={{ marginTop: 60 }}
        >
          <Grid item xs={5} sm={4} md={3}>
            <PrimaryButton
              sizeFlag={true} // if size flag be true than fontsize will be 18px if not true than 16px
              fullWidth
              onClick={onResend}
            >
              Resend
            </PrimaryButton>
          </Grid>
          <Grid item xs={5} sm={4} md={3}>
            <PrimaryButton
              sizeFlag={true} // if size flag be true than fontsize will be 18px if not true than 16px
              fullWidth
              onClick={onLoginClick}
            >
              Back to Login
            </PrimaryButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default EmailSent;
