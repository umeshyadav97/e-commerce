import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import { PrimaryButton } from "./index";
import ErrorImg from "../assets/images/404_Error_Img.svg";
import styles from "./ErrorPage.module.css";

const HEADER = "Page Not Found";
const DEFAULT_MESSAGE = `We’re sorry, the page you requested could not be found`;
const BTN_TEXT = `Go To Home`;

const ErrorPage = ({
  code = "404",
  header = HEADER,
  message = DEFAULT_MESSAGE,
  btnText = BTN_TEXT,
}) => {
  const history = useHistory();
  return (
    <React.Fragment>
      <Grid container className={styles.container}>
        <Grid item xs={12} md={6} className={styles.img_box}>
          <img className={styles.error_img} src={ErrorImg} alt="Error" />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          container
          direction="column"
          className={styles.info_box}
        >
          <Grid item className={styles.first_line}>
            <Typography variant="h4" className={styles.code}>
              {code}
            </Typography>
          </Grid>
          <Grid item className={styles.second_line}>
            <Typography variant="h3" className={styles.header}>
              {header}
            </Typography>
          </Grid>
          <Grid item className={styles.third_line}>
            <Typography variant="h4" className={styles.content}>
              {message}
            </Typography>
          </Grid>
          <Grid item className={styles.fourth_line}>
            <PrimaryButton
              wide
              onClick={() => history.push("/home")}
            >
              <Typography variant="h4" className={styles.side_header}>
               {btnText}
              </Typography>
            </PrimaryButton>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ErrorPage;
