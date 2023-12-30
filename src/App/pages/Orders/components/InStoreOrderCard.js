import React from "react";
import { Grid, Typography, useMediaQuery } from "@material-ui/core";
import { ChipButton, OutlinedPrimaryButton } from "../../../components";
import styles from "../Orders.module.css";
import { convertDateFormat } from "../../../../utils/dateUtils";
import { capitalizeStr, removeUnderScore } from "../../../../utils/textUtils";

const getStatusColor = (key) => {
  switch (key) {
    case "PENDING":
      return "#FDF0C6";
    case "IN_PROGRESS":
      return "#FDF0C6";
    case "COMPLETED":
      return "#E5F8F2";
    case "REFUND":
      return "#DFE7F5";
    case "CANCELLED":
      return "#FFAAA5";
    default:
      return "#FDF0C6";
  }
};

const getColor = (key) => {
  switch (key) {
    case "PENDING":
      return "#D18F2C";
    case "IN_PROGRESS":
      return "#D18F2C";
    case "COMPLETED":
      return "#01BF81";
    case "REFUND":
      return "#708099";
    case "CANCELLED":
      return "#F36666";
    default:
      return "#D18F2C";
  }
};

const InStoreOrderCard = ({ data, viewDetail }) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const mdScreen = useMediaQuery("(max-width:960px)");
  const order_date = convertDateFormat(data.created_at);
  const COLOR = getStatusColor(data.order_status);
  const ORDER_STATUS =
    data.order_status === "IN_PROGRESS"
      ? "In Progress"
      : data.order_status === "REFUND"
      ? "Refunded"
      : data.order_status === "PARTIAL_REFUND"
      ? "Partial Refunded"
      : removeUnderScore(capitalizeStr(data.order_status));
  const STATUSCOLOR = getColor(data.order_status);

  return (
    <React.Fragment>
      <Grid container item className={styles.order_card_store}>
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
              {!mobileScreen && `ORDER `}
            </span>
            <span className={styles.side_header}>#{data.order_num}</span>
          </Grid>
          <Grid item>
            <ChipButton
              color={COLOR}
              textColor={STATUSCOLOR}
              label={ORDER_STATUS}
              style={{ padding: "7px 16px", fontFamily: "Inter SemiBold" }}
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
        {/* Product Type & No of items/Delivery Type */}
        <Grid container direction="column" className={styles.card_column}>
          <Grid item>
            <span className={styles.card_label}>{`Product Type:`}</span>
            <span
              className={
                data.order_type === "CUSTOM" ? styles.custom : styles.rtw
              }
            >
              {data.order_type === "CUSTOM" ? "Customize" : "RTW"}
            </span>
          </Grid>
          <Grid item>
            <span className={styles.card_label}>{`Designer:`}</span>
            <span className={styles.card_content}>
              {capitalizeStr(data.designer)}
            </span>
          </Grid>
        </Grid>
        {/* Store & Designer Name */}
        <Grid container direction="column" className={styles.card_column}>
          <Grid item>
            <span className={styles.card_label}>{`Store Name:`}</span>
            <span className={styles.card_content}>{data.store}</span>
          </Grid>
          <Grid item>
            <span className={styles.card_label}>{`Delivery Type:`}</span>
            <span className={styles.card_content}>
              {capitalizeStr(removeUnderScore(data?.delivery_type))}
            </span>
          </Grid>
        </Grid>
        {/* View details btn */}
        {mdScreen && (
          <Grid
            container
            direction="column"
            className={styles.card_column}
          ></Grid>
        )}
        <Grid
          container
          justifyContent="flex-end"
          alignItems="center"
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

export default InStoreOrderCard;
