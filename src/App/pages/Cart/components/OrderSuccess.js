import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  setCart,
  getOrdertDetail,
} from "../../../../redux/actions/authActions";
import { Grid, Typography } from "@material-ui/core";
import { PrimaryButton, OutlinedPrimaryButton } from "../../../components";
import ErrorPage from "../../../components/ErrorPage";
import styles from "./OrderSuccess.module.css";
import PaymentDetails from "./PaymentDetails";
import { convertDateFormat, getLocalTime } from "../../../../utils/dateUtils";
import { capitalize, capitalizeStr } from "../../../../utils/textUtils";
import GreenTick from "../../../assets/icons/green-tick.svg";

const OrderSuccess = ({ ...props }) => {
  let order = props?.location?.state?.data;

  let date, localTime;
  if (!!order) {
    let temp = order.order_data;
    temp["total_items"] = order.order_items.length;
    temp["shipping_fee"] = order.order_data.total_shipping_fee;
    temp["tax"] = order.order_data.total_tax;
    temp["stripe_fee"] = order.order_data.total_stripe_fee;
    order["order_data"] = temp;
    date = convertDateFormat(order.order_data.order_date);
    const db_time = order.order_data.order_time;
    localTime = getLocalTime(`${date}, ${db_time}`);
  }

  const handleAppointment = (data) => {
    props.getOrdertDetail(data);
    props.history.push(`/create-appointment/${data?.id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    props.setCart(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {!!order ? (
        <div className={styles.order_success}>
          <Grid
            container
            justifyContent="center"
            className={styles.order_success_msg_grid}
          >
            <Grid item style={{ display: "flex", justifyContent: "center" }}>
              <img src={GreenTick} alt="success" className={styles.greenTick} />
            </Grid>
            <Grid item justifyContent="center" className={styles.header_box}>
              <Typography variant="h3" className={styles.header}>
                Your order has been placed!
              </Typography>
              <div className={styles.rectangle}></div>
            </Grid>
          </Grid>
          <Grid container className={styles.box}>
            <Grid item container direction="column">
              {/* Order Details */}
              <Grid item container className={styles.order_details}>
                <Grid container className={styles.header_padding}>
                  <Typography variant="h4" className={styles.side_header}>
                    Order Details
                  </Typography>
                </Grid>
                <Grid container>
                  {/* Order Date */}
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography variant="h4" className={styles.label}>
                      Order Date
                    </Typography>
                    <Typography variant="h4" className={styles.content}>
                      {`${date}, ${localTime}`}
                    </Typography>
                  </Grid>
                  {/* Phone Number */}
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography variant="h4" className={styles.label}>
                      Phone Number
                    </Typography>
                    <Typography variant="h4" className={styles.content}>
                      {`${order.order_data?.shipping_address?.country_code}-${order.order_data?.shipping_address?.phone}`}
                    </Typography>
                  </Grid>
                  {/* Payment Method */}
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography variant="h4" className={styles.label}>
                      Payment Method
                    </Typography>
                    <Typography variant="h4" className={styles.content}>
                      {`${
                        capitalize(order.order_data?.card_info?.brand) || "Visa"
                      } ************${
                        order.order_data?.card_info?.last4 || "****"
                      } `}
                    </Typography>
                  </Grid>
                  {/* Delivery Address */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    className={styles.delivery_address}
                  >
                    <Typography variant="h4" className={styles.label}>
                      Delivery Address
                    </Typography>
                    <Grid
                      item
                    >{`${order.order_data?.shipping_address?.address_one}`}</Grid>
                    <Grid
                      item
                    >{`${order.order_data?.shipping_address?.address_two}`}</Grid>
                    <Grid
                      item
                    >{`${order.order_data?.shipping_address?.city}, ${order.order_data?.shipping_address?.state}`}</Grid>
                    <Grid
                      item
                    >{`${order.order_data?.shipping_address?.country}, ${order.order_data?.shipping_address?.zip_code}`}</Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* Order items */}
              <Grid item container>
                {order.order_items.map((data, index) => (
                  <Grid key={index} container className={styles.order_card}>
                    {/* Particular designer orders */}
                    <Grid container item xs={12} sm={8} direction="column">
                      {/* Order-no */}
                      <Grid item className={styles.header_content}>
                        <Typography
                          variant="h4"
                          className={styles.side_header}
                        >{`Order Id: #${data.unique_order_id}`}</Typography>
                      </Grid>
                      {/* Total Price */}
                      <Grid item container>
                        <Typography
                          variant="h4"
                          className={styles.order_info_label}
                        >
                          {`Total Price: `}
                        </Typography>
                        <Typography className={styles.order_info_content}>
                          {`$${data.total_amount || "N/A"}`}
                        </Typography>
                      </Grid>
                      {/* No of Items */}
                      <Grid item container>
                        <Typography
                          variant="h4"
                          className={styles.order_info_label}
                        >
                          {`No of items: `}
                        </Typography>
                        <Typography className={styles.order_info_content}>
                          {`${data.number_of_items || "N/A"}`}
                        </Typography>
                      </Grid>
                      {/* Designer name */}
                      <Grid item container>
                        <Typography
                          variant="h4"
                          className={styles.order_info_label}
                        >
                          {`Designer: `}
                        </Typography>
                        <Typography className={styles.order_info_content}>
                          {`${capitalizeStr(data.designer_info.name) || "N/A"}`}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* View Order Details */}
                    <Grid item xs={12} sm={4} container justify="flex-end">
                      <a className={styles.link} href={`/orders/${data.id}`}>
                        <OutlinedPrimaryButton wide size="large">
                          <Typography
                            variant="h4"
                            className={styles.side_header}
                          >
                            View details
                          </Typography>
                        </OutlinedPrimaryButton>
                      </a>
                      <Grid item className={styles.app_btn}>
                        <OutlinedPrimaryButton
                          issecondary
                          wide
                          size="large"
                          className={styles.app_btn_txt}
                          onClick={() => handleAppointment(data)}
                        >
                          Book An Appointment
                        </OutlinedPrimaryButton>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              {/* Continue Shopping btn */}
              <Grid container>
                <PrimaryButton
                  className={styles.dashboard_btn}
                  type="submit"
                  fullWidth
                  onClick={() => props.history.push("/home")}
                >
                  <Typography variant="h4" className={styles.side_header}>
                    Continue Shopping
                  </Typography>
                </PrimaryButton>
              </Grid>
            </Grid>
            {/* Payment Summary */}
            <Grid item container direction="column" xs={12}>
              <PaymentDetails
                data={order.order_data}
                hideButton={true}
                title="Payment Summary"
              />
            </Grid>
          </Grid>
        </div>
      ) : (
        <ErrorPage />
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCart: (count) => dispatch(setCart(count)),
  getOrdertDetail: (data) => dispatch(getOrdertDetail(data)),
});

export default connect(null, mapDispatchToProps)(OrderSuccess);
