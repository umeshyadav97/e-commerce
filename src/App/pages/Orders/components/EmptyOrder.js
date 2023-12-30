import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import { PrimaryButton } from "../../../components";
import EmptyOrderImage from "../../../assets/images/No-orders.svg";
import styles from "../Orders.module.css";

const EmptyOrder = () => {
  const history = useHistory();
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      className={styles.empty_orders}
    >
      <Grid item>
        <img
          src={EmptyOrderImage}
          alt="No Address Found"
          className={styles.empty_order_image}
        />
      </Grid>
      <Grid item className={styles.first_line}>
        <Typography variant="h4" className={styles.side_header}>
          No Orders yet!!
        </Typography>
      </Grid>
      <Grid item className={styles.muted_line}>
        <Typography variant="h4" className={styles.muted_text}>
          You don't have any ongoing orders
        </Typography>
      </Grid>
      <Grid item>
        <PrimaryButton
          className={styles.shop_now_btn}
          onClick={() => history.push("/home")}
        >
          <Typography variant="h4" className={styles.side_header}>
            Shop Now
          </Typography>
        </PrimaryButton>
      </Grid>
    </Grid>
  );
};

export default EmptyOrder;
