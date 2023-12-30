import React from "react";
import { Grid, Typography, useMediaQuery } from "@material-ui/core";
import { ChipButton, OutlinedPrimaryButton } from "../../../components";
import styles from "../Orders.module.css";
import { convertDateFormat } from "../../../../utils/dateUtils";
import { capitalize } from "../../../../utils/textUtils";

const getStatusColor = (key) => {
  switch (key) {
    case "PENDING":
      return "#FFF0C1";
    case "ACCEPTED":
      return "#FFD5CD";
    case "IN_PROGRESS":
      return "#F6C87A";
    case "SHIPPED":
      return "#F9D89C";
    case "DELIVERED":
      return "#C6EBC9";
    case "CANCELLED":
    case "REJECTED":
      return "#FFAAA5";
    default:
      return "#FFF0C1";
  }
};

const OrderListCard = ({ data, viewDetail }) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const mdScreen = useMediaQuery("(max-width:960px)");
  const order_date = convertDateFormat(data.created_at);
  const designer_name = `${data.designer?.first_name} ${data.designer?.last_name}`;
  const COLOR = getStatusColor(data.order_status);
  const ORDER_STATUS =
    data.order_status === "IN_PROGRESS"
      ? "In Progress"
      : capitalize(data.order_status);

  return (
    <React.Fragment>
      <Grid container item className={styles.order_card}>
        {/* Order-no & Status */}
        <Grid
          container
          direction={mdScreen ? "row" : "column"}
          className={styles.card_column}
        >
          <Grid item>
            <span
              className={mobileScreen ? styles.side_header : styles.card_label}
            >
              {mobileScreen ? "#" : `ORDER `}
            </span>
            <span className={styles.side_header}>#{data.unique_order_id}</span>
          </Grid>
          <Grid item>
            <ChipButton
              color={COLOR}
              textColor="#242424"
              label={ORDER_STATUS}
            />
          </Grid>
        </Grid>
        {/* Date & Total Amount of order */}
        <Grid container direction="column" className={styles.card_column}>
          <Grid item>
            <span className={styles.card_label}>{`Date:`}</span>
            <span className={styles.card_content}>{order_date}</span>
          </Grid>
          <Grid item>
            <span className={styles.card_label}>{`Total Price:`}</span>
            <span
              className={styles.card_content}
            >{`$${data.total_amount}`}</span>
          </Grid>
        </Grid>
        {/* No of items & Designer */}
        <Grid container direction="column" className={styles.card_column}>
          <Grid item>
            <span className={styles.card_label}>{`No. of Items:`}</span>
            <span className={styles.card_content}>{data.product_count}</span>
          </Grid>
          <Grid item>
            <span className={styles.card_label}>{`Designer:`}</span>
            <span className={styles.card_content}>{designer_name}</span>
          </Grid>
        </Grid>
        {/* View details btn */}
        <Grid
          container
          justify="flex-end"
          alignItems="flex-end"
          className={styles.view_details_grid}
        >
          <OutlinedPrimaryButton wide size="large" onClick={viewDetail}>
            <Typography variant="h4" className={styles.side_header}>
              View details
            </Typography>
          </OutlinedPrimaryButton>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default OrderListCard;
