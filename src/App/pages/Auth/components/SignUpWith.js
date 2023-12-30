import { Divider, Grid } from "@material-ui/core";
import React from "react";
import FacebookSignUp from "./FacebookSignUp";
import GoogleSignUp from "./GoogleSignUp";

export default function SignUpWith() {
  return (
    <React.Fragment>
      <Grid
        container
        justifyContent="center"
        style={{ marginTop: "30px" }}
        spacing={3}
      >
        <Grid item xs={3}>
          <Divider style={{ marginTop: "10px" }} />
        </Grid>
        <Grid item>
          <span style={{ color: "#A4B3CC" }}> Or Sign Up with </span>
        </Grid>
        <Grid item xs={3}>
          <Divider style={{ marginTop: "10px" }} />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        style={{ marginTop: "22px", marginBottom: "24px" }}
      >
        <Grid item>
          <GoogleSignUp />
        </Grid>
        <Grid item>
          <FacebookSignUp />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
