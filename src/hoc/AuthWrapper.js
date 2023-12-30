import React from "react";
import { Redirect, Route, useHistory } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import NoNetwork from "../App/assets/images/no_network.png";
import styles from "./NoNetwork.module.css";
import { PrimaryButton } from "../App/components";
import { connect } from "react-redux";
import { VALIDITY_DATE } from "../storage/StorageKeys";
import StorageManager from "../storage/StorageManager";

const AuthWrapper = ({ component: Component, isAuthenticated, ...rest }) => {
  const [network, setNetwork] = useState(true);
  const handleNetworkRecovery = () => {
    window.location.reload();
  };
  const history = useHistory();

  const ExpiryDate = new Date(StorageManager.get(VALIDITY_DATE));

  var CurrentDate = new Date();

  useEffect(() => {
    // Add network listener
    networkCheck();
    /*If Date exceeds login date clear storage */
    if (
      ExpiryDate < CurrentDate &&
      window.location.pathname !== "/home" &&
      window.location.pathname !== "/designers"
    ) {
      StorageManager.clearStore();
      history.push("/auth/login");
    }

    return () => window.removeEventListener("offline", () => listener(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const networkCheck = () => {
    setNetwork(navigator.onLine);
    window.addEventListener("online", () => listener(true));
    window.addEventListener("offline", () => listener(false));
  };

  const listener = (status) => {
    setNetwork(status);
  };
  return (
    <Route
      {...rest}
      render={(props) =>
        (isAuthenticated === true && ExpiryDate > CurrentDate) ||
        props.location.pathname === "/home" ||
        props.location.pathname === "/designers" ? (
          network ? (
            <Component {...props} />
          ) : (
            <Grid container className={styles.container}>
              <Grid item xs={12} md={4} className={styles.img_box}>
                <img
                  className={styles.error_img}
                  src={NoNetwork}
                  alt="Poor Network"
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={8}
                container
                direction="column"
                className={styles.info_box}
              >
                <Grid item className={styles.first_line}>
                  <Typography variant="h4" className={styles.code}>
                    No Internet Connection
                  </Typography>
                </Grid>
                <Grid item className={styles.second_line}>
                  <Typography variant="h3" className={styles.header}>
                    Please Check Your Network And Try Again.
                  </Typography>
                </Grid>
                <Grid item className={styles.third_line}>
                  <PrimaryButton wide onClick={() => handleNetworkRecovery()}>
                    <Typography variant="h4" className={styles.side_header}>
                      Refresh Page
                    </Typography>
                  </PrimaryButton>
                </Grid>
              </Grid>
            </Grid>
          )
        ) : (
          <Redirect
            to={{
              pathname: "/auth/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps)(AuthWrapper);
