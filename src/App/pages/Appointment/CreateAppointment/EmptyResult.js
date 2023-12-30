import React from "react";
import { Grid, Typography } from "@material-ui/core";
import styles from "../appointment.module.css";
import EmptyProductImage from "../../../assets/icons/Empty_Product.png";

const EmptyResult = ({ isSearch = false }) => {
  return (
    <Grid container item direction="column" alignItems="center">
      <Grid item>
        <img src={EmptyProductImage} alt="No Product Found" />
      </Grid>
      {isSearch ? (
        <>
          <Grid item className={styles.first_line}>
            <Typography variant="h4" className={styles.first_line_text}>
              We couldn’t find any matches
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" className={styles.muted_text}>
              Please try searching something else
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          <>
            <Grid item className={styles.first_line}>
              <Typography variant="h4" className={styles.first_line_text}>
                No Product Found
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" className={styles.muted_text}>
                No new products has been found
              </Typography>
            </Grid>
          </>
        </>
      )}
    </Grid>
  );
};

export default EmptyResult;
