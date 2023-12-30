import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { convertDateFormat } from "../../../../utils/dateUtils";
import styles from "../Orders.module.css";

const RefundDetails = ({ data }) => {
  const { amount, refund_date, refund_id, status } = data;
  const date = refund_date
    ? convertDateFormat(refund_date)
    : convertDateFormat(new Date());
  return (
    <React.Fragment>
      <Grid container direction="column" className={styles.promo_card}>
        <Grid item>
          <Typography
            variant="h4"
            className={`${styles.side_header} ${styles.payment_header}`}
          >
            {`Refund Details`}
          </Typography>
        </Grid>
        {/* Refund Date */}
        <Grid
          item
          container
          justify="space-between"
          className={styles.sub_total}
        >
          <Grid item>
            <Typography variant="h4" className={styles.payment_text}>
              {`Refund Date`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" className={styles.payment_amount}>
              {date || "N/A"}
            </Typography>
          </Grid>
        </Grid>
        {/* Amount */}
        <Grid
          item
          container
          justify="space-between"
          className={styles.shipping}
        >
          <Grid item>
            <Typography variant="h4" className={styles.payment_text}>
              Amount
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" className={styles.payment_amount}>
              {amount ? `$${amount.toLocaleString()}` : "N/A"}
            </Typography>
          </Grid>
        </Grid>
        {/* Transaction id */}
        <Grid
          item
          container
          justify="space-between"
          className={styles.shipping}
        >
          <Grid item>
            <Typography variant="h4" className={styles.payment_text}>
              Transaction Id
            </Typography>
          </Grid>
          <Grid item xs={6}>
              <Typography variant="h4" className={styles.payment_amount}>
                {refund_id ? `${refund_id}` : "N/A"}
              </Typography>
          </Grid>
        </Grid>
        {/* Status */}
        <Grid item container justify="space-between" className={styles.total}>
          <Grid item>
            <Typography variant="h4" className={styles.total_text}>
              Payment Status
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" className={styles.total_text}>
              {status ? `${status}` : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default RefundDetails;
