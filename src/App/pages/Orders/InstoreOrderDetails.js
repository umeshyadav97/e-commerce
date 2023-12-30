import { Divider, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import {
  ChipButton,
  LoaderContent,
  OutlinedPrimaryButton,
  Toast,
} from "../../components";
import styles from "./Orders.module.css";
import Reschedule from "../../assets/icons/reschedule-clock.svg";
import { API, ENDPOINTS } from "../../../api/apiService";
import { capitalizeStr, removeUnderScore } from "../../../utils/textUtils";
import { convertDateFormat } from "../../../utils/dateUtils";
import TransactionSummary from "./components/TransactionSummary";
import RefundSummary from "./components/RefundSummary";
import CustomRefund from "./components/CustomRefundSummary";
import DownArrow from "../../assets/icons/down-arrow.svg";
import UpArrow from "../../assets/icons/up_arrow.svg";
import moment from "moment";
import RescheduleAppointment from "../Appointment/Cancel&Reschedule/RescheduleAppointment";
import Appointments from "./components/Appointments";
import OnlineDeliveryStepper from "./components/Steppers/OnlineDeliveryStepper";
import StoreDeliveryStepper from "./components/Steppers/StoreDeliveryStepper";
import PickUpStepper from "./components/Steppers/PickUpStepper";
import ScheduleFollowUp from "../Appointment/Cancel&Reschedule/ScheduleFollowUp";

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

const InstoreOrderDetails = (props) => {
  const isLoggedIn = props?.isAuthenticated;
  const ID = props?.match?.params?.id;
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState();
  const [refund, setRefund] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [refundSummary, setRefundSummary] = useState(false);
  const [transactionSummary, setTransactionSummary] = useState(false);
  const [openRefund, setOpenRefund] = useState("");
  const [refundInfo, setRefundInfo] = useState();
  const [refundMode, setRefundMode] = useState();
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [designerId, setDesignerId] = useState();
  const [prevStore, setPrevStore] = useState();
  const [storeList, setStoreList] = useState([]);
  const [appointments, setAppointments] = useState(false);
  const [followUp, setFollowUp] = useState(false);

  const handelAppointments = () => {
    setAppointments(!appointments);
  };

  const handelFollowUp = (DesignerId, Store) => {
    setFollowUp(!followUp);
    setDesignerId(DesignerId);
    setPrevStore(Store);
  };

  const handleMeeting = (id) => {
    props?.history.push(`/appointment-details/${id}`);
  };

  const handleRefundSummary = (refund, mode) => {
    setRefundSummary(true);
    setRefundInfo(refund);
    setRefundMode(mode);
  };

  const handleCloseRefundSummary = () => {
    setRefundSummary(false);
  };

  const handleTransactionSummary = () => {
    setTransactionSummary(true);
  };

  const handleCloseTransactionSummary = () => {
    setTransactionSummary(false);
  };

  const handleOpenRefund = (id) => {
    if (id === openRefund) {
      setOpenRefund("");
    } else {
      setOpenRefund(id);
    }
  };

  const handleRescheduleModal = (DesignerId, Store) => {
    setRescheduleModal(!rescheduleModal);
    setDesignerId(DesignerId);
    setPrevStore(Store);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const resp = await API.get(`${ENDPOINTS.STOREORDERDETAIL}${ID}/detail`);
      if (resp.success) {
        const temp = resp.data;
        setRecord(temp);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg || `Error Fetching Orders Details. Please Refresh`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTransaction = async () => {
    setLoading(true);
    const queryURL = `/store/admin/${ID}/transaction-list`;
    const response = await API.get(queryURL, {});
    if (response.success) {
      setLoading(false);
      setTransactions(response?.data);
    } else {
      const msg = response.error?.message;
      Toast.showErrorToast(
        msg || `Error Fetching Transaction Details. Please Refresh`
      );
    }
    setLoading(false);
  };

  const fetchRefundDetails = async () => {
    setLoading(true);
    const queryURL = `/store/${ID}/refund-summary`;
    const response = await API.get(queryURL, {});
    if (response.success) {
      setLoading(false);
      setRefund(response?.data);
    } else {
      const msg = response.error?.message?.[0];
      Toast.showErrorToast(
        msg || `Error Fetching Refund Details. Please Refresh`
      );
    }
    setLoading(false);
  };

  const getStoreLocation = async () => {
    try {
      const resp = await API.get(
        `appointments/customer/${designerId}/store-list`
      );
      if (resp.success) {
        const result = resp.data;
        let temp = result.map((item) => ({
          value: item.id,
          label:
            item.name +
            "-" +
            item.address_line_1 +
            ", " +
            item.state +
            ", " +
            item.postal_code,
          id: item.id,
        }));
        temp.unshift({
          label: "Store Location",
          value: 0,
        });
        setStoreList(temp);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || "Error in fetching Store List!");
    }
  };

  useEffect(() => {
    if (designerId) {
      getStoreLocation();
    }
    // eslint-disable-next-line
  }, [designerId]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      fetchRefundDetails();
      fetchTransaction();
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      {!isLoggedIn ? <Redirect to="/auth/login" /> : null}
      {loading ? (
        <LoaderContent />
      ) : (
        <Grid container className={styles.order_detail}>
          {/* Back button */}
          <Grid container item>
            <Typography
              variant="h4"
              className={styles.back_button}
              onClick={() => props.history.push("/orders")}
            >
              Back to orders
            </Typography>
          </Grid>
          {/* Heading */}
          <Grid container alignItems="center" className={styles.detail_header}>
            <Grid item xs={12} lg={9}>
              <Grid
                container
                spacing={2}
                className={styles.instore_order_detail_header}
              >
                {/* Order-no */}
                <Grid item className={styles.center_align}>
                  <Typography
                    variant="h4"
                    className={styles.order_details_sideHeader}
                  >
                    #{`${record?.order_num}`}
                  </Typography>
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  className={styles.vertical_divider}
                />
                {/* Order Type */}
                <Grid item className={styles.center_align}>
                  <Typography className={styles.total_text}>
                    {`In Store`}
                  </Typography>
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  className={styles.vertical_divider}
                />
                {/* Date of Order */}
                <Grid item className={styles.center_align}>
                  <Typography className={styles.header_content}>
                    {convertDateFormat(record?.created_at)}
                  </Typography>
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  className={styles.vertical_divider}
                />
                {/* Total Price */}
                <Grid item className={styles.center_align}>
                  <Typography
                    className={styles.header_content}
                  >{`Total Price: $${record?.total_amount}`}</Typography>
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  className={styles.vertical_divider}
                />
                {/* Designer */}
                <Grid item className={styles.center_align}>
                  <Typography
                    className={styles.header_content}
                  >{`Desginer: ${capitalizeStr(
                    record?.designer_name
                  )}`}</Typography>
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  className={styles.vertical_divider}
                />
                {/* Delivery Type */}
                <Grid item className={styles.center_align}>
                  <Typography className={styles.header_content}>
                    {capitalizeStr(removeUnderScore(record?.delivery_type))}
                  </Typography>
                </Grid>
                {/* Status */}
                <Grid item className={styles.center_align}>
                  <ChipButton
                    color={getStatusColor(record?.order_status)}
                    textColor={getColor(record?.order_status)}
                    label={
                      record?.order_status === "IN_PROGRESS"
                        ? "In Progress"
                        : record?.order_status === "REFUND"
                        ? "Refunded"
                        : record?.order_status === "PARTIAL_REFUND"
                        ? "Partial Refunded"
                        : removeUnderScore(capitalizeStr(record?.order_status))
                    }
                    style={{ maxWidth: "110px", padding: "7px 10px" }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Grid container className={styles.action_btn_grid}>
                {/* Book Appointment */}
                {(record?.order_status === "IN_PROGRESS" ||
                  record?.order_status === "PARTIAL_REFUND" ||
                  record?.order_status === "COMPLETED") &&
                  (record?.meeting_list.length > 0 ? (
                    (record?.appointment?.status === "CANCELLED" ||
                      record?.appointment?.status === "COMPLETED") && (
                      <OutlinedPrimaryButton
                        wide
                        size="large"
                        onClick={() =>
                          handelFollowUp(record?.designer_id, record?.store_id)
                        }
                        style={{ margin: "5px 0px" }}
                      >
                        <Typography
                          variant="h4"
                          className={styles.action_btn_txt}
                        >
                          Schedule Follow-Up Appointment
                        </Typography>
                      </OutlinedPrimaryButton>
                    )
                  ) : (
                    <OutlinedPrimaryButton
                      wide
                      size="large"
                      onClick={() =>
                        props.history.push({
                          pathname: `/create-appointment/${ID}`,
                          state: {
                            product_id: record?.order_items?.map((item) =>
                              item.item_info
                                ? item.item_info.product
                                : item.product_id
                            ),
                            DesignerId: record?.designer_id,
                            storeId: record?.store_id,
                            OrderItem: record?.order_items,
                            OrderID: record?.id,
                          },
                        })
                      }
                      className={styles.action_btn}
                    >
                      <Typography
                        variant="h4"
                        className={styles.action_btn_txt}
                      >
                        Book An Appointment
                      </Typography>
                    </OutlinedPrimaryButton>
                  ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            justifyContent="space-between"
            className={styles.order_detail_box}
          >
            <Grid item xs={12} container className={styles.order_list}>
              {record?.order_type === "CUSTOM" &&
                (record?.order_status === "IN_PROGRESS" ||
                  record?.order_status === "COMPLETED") && (
                  <Grid item xs={12} className={styles.order_info_title}>
                    <Grid item>
                      <Typography
                        className={`${styles.heading} ${styles.paddingLeft0}`}
                      >
                        {record?.delivery_type === "PICK_UP"
                          ? "Pickup"
                          : record?.delivery_type === "DELIVERY"
                          ? "Online Delivery"
                          : "Store Delivery"}
                      </Typography>
                    </Grid>
                    {record?.delivery_type === "PICK_UP" ? (
                      <PickUpStepper
                        OrderStatus={record?.order_tracking?.order_status}
                      />
                    ) : record?.delivery_type === "DELIVERY" ? (
                      <OnlineDeliveryStepper
                        OrderStatus={record?.order_tracking?.order_status}
                        OrderTracking={record?.order_tracking}
                      />
                    ) : (
                      <StoreDeliveryStepper
                        OrderStatus={record?.order_tracking?.order_status}
                        OrderTracking={record?.order_tracking}
                      />
                    )}
                  </Grid>
                )}
              {record?.order_items?.map((pro, index) => (
                <Grid item key={index} className={styles.product_grid}>
                  <Grid container justifyContent="space-between">
                    <img
                      src={pro?.cover_image_url}
                      alt="product"
                      className={styles.product_img}
                    />
                    <Grid item xs={7} md={6} lg={7}>
                      <Grid container>
                        <Grid item>
                          <Typography className={styles.side_header}>
                            {capitalizeStr(pro?.product)}{" "}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={styles.side_header}>
                            ${pro?.original_price}
                          </Typography>
                        </Grid>
                      </Grid>
                      {/*Custom Product Details */}
                      {record?.order_type !== "READY_TO_WEAR" ? (
                        <>
                          <Grid container style={{ marginTop: "8px" }}>
                            {pro?.size_id && (
                              <Grid item style={{ margin: "0px 4px 0px 0px" }}>
                                <Typography className={styles.varientSize}>
                                  {`${pro?.size_name} |`}
                                </Typography>
                              </Grid>
                            )}
                            {record?.options?.map((child, index) =>
                              child?.child_option?.map(
                                (sub_option, sub_index) => (
                                  <Grid
                                    item
                                    style={
                                      sub_index > 0
                                        ? { margin: "0px 4px" }
                                        : { margin: "0px" }
                                    }
                                    key={sub_option?.id}
                                  >
                                    <Typography className={styles.varientSize}>
                                      {`${
                                        index === 0 && sub_index === 0
                                          ? ""
                                          : "|"
                                      }  ${sub_option?.title} `}
                                    </Typography>
                                  </Grid>
                                )
                              )
                            )}
                            {record?.accessories?.map((acessory, index) => (
                              <Grid
                                key={index}
                                item
                                style={{ margin: "0px 4px" }}
                              >
                                <Typography className={styles.varientSize}>
                                  {`|  ${acessory?.title} `}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                          {/* Custom Product custom sizes */}
                          <Grid container mt={1}>
                            {Object.entries(record?.measurement).map(
                              ([key, value]) => (
                                <Grid
                                  item
                                  key={key}
                                  style={{
                                    border: "1px solid #DFE7F5",
                                    background: "#DFE7F5",
                                    borderRadius: "8px",
                                    margin: "8px",
                                  }}
                                >
                                  <Typography
                                    p={1}
                                    className={styles.customSize_txt_1}
                                  >
                                    {key}
                                  </Typography>
                                  <Typography
                                    p={1}
                                    className={styles.customSize_txt}
                                  >
                                    {value} inch
                                  </Typography>
                                </Grid>
                              )
                            )}
                          </Grid>
                        </>
                      ) : (
                        <Grid item>
                          <Grid item>
                            <Typography className={styles.cancel_btn_text}>
                              Size:{" "}
                              <span className={styles.txt}>
                                {pro.size_name}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography className={styles.cancel_btn_text}>
                              Color:{" "}
                              <span className={styles.txt}>
                                {pro.variant || "NA"}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography className={styles.cancel_btn_text}>
                              Quantity:{" "}
                              <span className={styles.txt}>{pro.quantity}</span>
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                    <Grid item>
                      <Typography
                        className={
                          record.order_type === "CUSTOM"
                            ? styles.custom
                            : styles.rtw
                        }
                      >
                        {record.order_type === "CUSTOM" ? "Customize" : "RTW"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid container className={styles.shipping_payment}>
              {/* Store Details */}
              <Grid container direction="column" className={styles.address_box}>
                <Grid item className={styles.order_address_header}>
                  <Typography variant="h4" className={styles.side_header}>
                    Store Details
                  </Typography>
                </Grid>
                <Divider
                  orientation="horizontal"
                  flexItem
                  className={styles.divider}
                />
                <Grid item>
                  {/* Staff Member Name */}
                  <Grid item className={styles.shipping_detail}>
                    <Grid item>
                      <div className={styles.muted_header}>Store Name</div>
                      <div className={styles.details_txt}>
                        {capitalizeStr(record?.store_info?.name)}
                      </div>
                    </Grid>
                    {/* Address */}
                    <Grid item className={styles.marginTop12}>
                      <div className={styles.muted_header}>Address</div>
                      <div className={styles.details_txt}>
                        {`${record?.store_info?.address_line_1}, ${
                          record?.store_info?.address_line_2
                            ? record?.store_info?.address_line_2 + ", "
                            : null
                        } ${record?.store_info?.city}, ${
                          record?.store_info?.state
                        }, ${record?.store_info?.postal_code}`}
                      </div>
                    </Grid>
                    {/* Contact Number */}
                    <Grid item className={styles.marginTop12}>
                      <div className={styles.muted_header}>Contact Number</div>
                      <div className={styles.details_txt}>
                        ({`${record?.store_info?.country_code}`}){" "}
                        {record?.store_info?.phone}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* Appointment Details */}
              {record?.appointment.appointment_date && (
                <Grid item className={styles.marginTop30}>
                  <Grid
                    container
                    direction="column"
                    className={styles.address_box}
                  >
                    <Grid container justifyContent="space-between">
                      <Grid item className={styles.order_address_header}>
                        <Typography variant="h4" className={styles.side_header}>
                          Appointment
                        </Typography>
                      </Grid>
                      <Grid item className={styles.order_address_header}>
                        <Typography
                          variant="h4"
                          className={styles.view_all}
                          onClick={handelAppointments}
                        >
                          View All
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider
                      orientation="horizontal"
                      flexItem
                      className={styles.divider}
                    />
                    <Grid item container className={styles.shipping_detail}>
                      {/* Store Name & Appointment */}
                      <Grid container justifyContent="space-between">
                        <div className={styles.muted_header}>
                          Store Name & Appointment
                        </div>
                        <div className={styles.details_txt}>
                          {`${capitalizeStr(
                            record?.appointment?.store_name
                          )} | ${record?.appointment?.appointment_number}`}
                        </div>
                      </Grid>
                      {/* Date */}
                      <Grid
                        container
                        justifyContent="space-between"
                        className={styles.marginTop12}
                      >
                        <div className={styles.muted_header}>Date</div>
                        <div className={styles.details_txt}>
                          {convertDateFormat(
                            record?.appointment?.appointment_date
                          )}
                        </div>
                      </Grid>
                      {/* Time */}
                      <Grid
                        container
                        justifyContent="space-between"
                        className={styles.marginTop12}
                      >
                        <div className={styles.muted_header}>Time</div>
                        <div className={styles.details_txt}>
                          {moment
                            .utc(record?.appointment?.start_time, "HH:mm")
                            .local()
                            .format("hh:mm A")}
                          -
                          {moment
                            .utc(record?.appointment?.end_time, "HH:mm")
                            .local()
                            .format("hh:mm A")}
                        </div>
                      </Grid>
                      {/* Status & Reschedule */}
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="baseline"
                        className={styles.marginTop12}
                      >
                        <div className={styles.muted_header}>Status</div>
                        <Grid item xs={8}>
                          <Grid container justifyContent="flex-end">
                            <Grid
                              item
                              className={
                                record?.appointment?.status === "PENDING"
                                  ? styles.pending_status
                                  : record?.appointment?.status === "UPCOMING"
                                  ? styles.upcoming_status
                                  : record?.appointment?.status === "COMPLETED"
                                  ? styles.completed_status
                                  : styles.decline_status
                              }
                            >
                              <Typography
                                className={
                                  record?.appointment?.status === "PENDING"
                                    ? styles.pending_text
                                    : record?.appointment?.status === "UPCOMING"
                                    ? styles.upcoming_text
                                    : record?.appointment?.status ===
                                      "COMPLETED"
                                    ? styles.completed_text
                                    : styles.decline_text
                                }
                              >
                                {capitalizeStr(record?.appointment?.status)}
                              </Typography>
                            </Grid>
                            {record?.appointment?.status === "PENDING" ||
                            record?.appointment?.status === "UPCOMING" ? (
                              <img
                                src={Reschedule}
                                alt="reschedule"
                                className={styles.marginLeft}
                                onClick={() =>
                                  handleRescheduleModal(
                                    record?.designer_id,
                                    record?.store_id
                                  )
                                }
                              />
                            ) : null}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {/* Payment Summary */}
              <Grid item className={styles.marginTop30}>
                <Grid
                  container
                  direction="column"
                  className={styles.address_box}
                >
                  <Grid
                    container
                    justifyContent="space-between"
                    className={styles.order_address_header}
                  >
                    <Grid item>
                      <Typography variant="h4" className={styles.side_header}>
                        Payment Summary
                      </Typography>
                    </Grid>
                    {record?.order_type === "CUSTOM" ? (
                      <Grid item>
                        <Typography
                          variant="h4"
                          className={styles.view_all}
                          onClick={handleTransactionSummary}
                        >
                          View Transaction
                        </Typography>
                      </Grid>
                    ) : null}
                  </Grid>
                  <Divider
                    orientation="horizontal"
                    flexItem
                    className={styles.divider}
                  />
                  <Grid item container className={styles.shipping_detail}>
                    {/* Sub Total */}
                    <Grid container justifyContent="space-between">
                      <div className={styles.muted_header}>Sub Total</div>
                      <div className={styles.details_txt}>
                        ${record?.sub_total}
                      </div>
                    </Grid>
                    {/* Mode of Payment */}
                    {record?.payment_method_name && (
                      <Grid
                        container
                        justifyContent="space-between"
                        className={styles.marginTop12}
                      >
                        <div className={styles.muted_header}>
                          Mode of Payment
                        </div>
                        <div className={styles.details_txt}>
                          {record?.payment_method_name}
                        </div>
                      </Grid>
                    )}
                    {/*  Tax */}
                    {record?.tax_info?.map((tax, index) => (
                      <Grid
                        container
                        justifyContent="space-between"
                        className={styles.marginTop12}
                        key={index}
                      >
                        <div
                          className={styles.muted_header}
                        >{`${tax.name} ${tax?.percentage}%`}</div>
                        <div className={styles.details_txt}>
                          ${tax?.tax_amount}
                        </div>
                      </Grid>
                    ))}
                    {/* Discount */}
                    {record?.total_discount > 0 && (
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="baseline"
                        className={styles.marginTop12}
                      >
                        <div className={styles.muted_header}>Discount</div>
                        <div className={styles.discount_txt}>
                          - ${record?.total_discount}
                        </div>
                      </Grid>
                    )}
                    {/* Total Paid Amount */}
                    <Grid
                      container
                      justifyContent="space-between"
                      className={styles.marginTop12}
                    >
                      <div className={styles.muted_header}>
                        Total Paid Amount
                      </div>
                      <div className={styles.details_txt}>
                        $
                        {record?.order_type !== "READY_TO_WEAR"
                          ? record?.total_paid_amount
                          : record?.order_amount}
                      </div>
                    </Grid>
                    {/* Total Pending Amount */}
                    {record?.order_type !== "READY_TO_WEAR" && (
                      <Grid
                        container
                        justifyContent="space-between"
                        className={styles.marginTop12}
                      >
                        <div className={styles.muted_header}>
                          {record?.total_pending_amount > 0
                            ? "Total Pending Amount"
                            : "Extra Paid Amount"}
                        </div>
                        <div className={styles.details_txt}>
                          ${Math.abs(record?.total_pending_amount)}
                        </div>
                      </Grid>
                    )}
                    {/* Store Credit */}
                    {record?.is_store_credit_used && (
                      <Grid
                        container
                        justifyContent="space-between"
                        className={styles.marginTop12}
                      >
                        <div className={styles.muted_header}>Store Credit</div>
                        <div className={styles.discount_txt}>
                          ${record?.store_credit_amount}
                        </div>
                      </Grid>
                    )}
                    <div className={styles.divider_1} />
                    {/* Total Amount */}
                    <Grid container justifyContent="space-between">
                      <div className={styles.muted_header}>Total Amount</div>
                      <div className={styles.side_header}>
                        ${record?.total_amount}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* Refund Summary */}
              {refund.length > 0 ? (
                <Grid item className={styles.marginTop30}>
                  <Grid
                    container
                    direction="column"
                    className={styles.address_box}
                  >
                    <Grid item xs={12}>
                      <Grid item className={styles.order_address_header}>
                        <Typography className={styles.header_1}>
                          Refund Summary
                        </Typography>
                      </Grid>
                      <Divider className={styles.divider} />
                      {refund.length === 1
                        ? refund?.map((ref, index) => (
                            <Grid
                              item
                              key={index}
                              className={styles.shipping_detail}
                            >
                              <Grid container xs={12}>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="h5"
                                    className={styles.summary_Heading}
                                  >
                                    Mode Of Refund
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  className={styles.textAlignEnd}
                                >
                                  <Typography
                                    variant="h5"
                                    className={styles.txt}
                                  >
                                    {removeUnderScore(capitalizeStr(ref.mode))}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid
                                container
                                xs={12}
                                style={{ marginTop: "10px" }}
                              >
                                <Grid item xs={6} md={6} sm={6} lg={6}>
                                  <Typography
                                    variant="h5"
                                    className={styles.summary_Heading}
                                  >
                                    Refunded By
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  md={6}
                                  sm={6}
                                  lg={6}
                                  className={styles.textAlignEnd}
                                >
                                  <Typography
                                    variant="h5"
                                    className={styles.txt}
                                  >
                                    {capitalizeStr(ref.refunded_by)}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid
                                container
                                xs={12}
                                style={{ marginTop: "10px" }}
                              >
                                <Grid item xs={4}>
                                  <Typography
                                    variant="h5"
                                    className={styles.summary_Heading}
                                  >
                                    Refund Date & Time
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={8}
                                  className={styles.textAlignEnd}
                                >
                                  <Typography
                                    variant="h5"
                                    className={styles.txt}
                                  >
                                    {`${ref.refund_date} ${ref.refund_time}`}
                                  </Typography>
                                </Grid>
                              </Grid>
                              {ref?.refund_transaction_id && (
                                <Grid
                                  container
                                  xs={12}
                                  style={{ marginTop: "10px" }}
                                >
                                  <Grid item xs={6} style={{ display: "flex" }}>
                                    <Typography
                                      variant="h5"
                                      className={styles.summary_Heading}
                                    >
                                      Refund Transaction ID
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={6}
                                    className={styles.textAlignEnd}
                                  >
                                    <Typography
                                      variant="h5"
                                      className={styles.txt}
                                    >
                                      {ref?.refund_transaction_id}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              )}
                              <Grid
                                container
                                xs={12}
                                md={12}
                                sm={12}
                                lg={12}
                                style={{ marginTop: "10px" }}
                              >
                                <Grid item xs={7}>
                                  <Typography
                                    variant="h5"
                                    className={styles.summary_Heading}
                                  >
                                    Total Refund Amount
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={5}
                                  className={styles.textAlignEnd}
                                >
                                  <Typography className={styles.header_1}>
                                    ${ref.total_refund_amount}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid item className={styles.marginBlock16}>
                                <Typography
                                  style={{
                                    color: "#FC68A2",
                                    fontFamily: "Inter SemiBold",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    paddingLeft: "0px",
                                  }}
                                  onClick={() =>
                                    handleRefundSummary(
                                      ref.refund_summary,
                                      ref.order_type
                                    )
                                  }
                                >
                                  View Summary
                                </Typography>
                              </Grid>
                            </Grid>
                          ))
                        : refund.map((ref, index) => (
                            <Grid
                              item
                              key={index}
                              className={styles.shipping_detail}
                            >
                              <Grid
                                container
                                justifyContent="space-between"
                                className={styles.marginBottom16}
                              >
                                <Grid item>
                                  <Typography
                                    className={`${styles.heading} ${styles.paddingLeft0}`}
                                  >
                                    Refund #{index + 1}
                                  </Typography>
                                </Grid>
                                <img
                                  className={styles.pointer}
                                  src={
                                    openRefund === index ? UpArrow : DownArrow
                                  }
                                  alt="arrow"
                                  onClick={() => handleOpenRefund(index)}
                                />
                              </Grid>
                              {openRefund === index && (
                                <>
                                  <Grid container xs={12}>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="h5"
                                        className={styles.summary_Heading}
                                      >
                                        Mode Of Refund
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={6}
                                      className={styles.textAlignEnd}
                                    >
                                      <Typography
                                        variant="h5"
                                        className={styles.txt}
                                      >
                                        {removeUnderScore(
                                          capitalizeStr(ref.mode)
                                        )}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    container
                                    xs={12}
                                    style={{ marginTop: "10px" }}
                                  >
                                    <Grid item xs={6} md={6} sm={6} lg={6}>
                                      <Typography
                                        variant="h5"
                                        className={styles.summary_Heading}
                                      >
                                        Refunded By
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={6}
                                      md={6}
                                      sm={6}
                                      lg={6}
                                      className={styles.textAlignEnd}
                                    >
                                      <Typography
                                        variant="h5"
                                        className={styles.txt}
                                      >
                                        {capitalizeStr(ref.refunded_by)}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    container
                                    xs={12}
                                    style={{ marginTop: "10px" }}
                                  >
                                    <Grid item xs={4}>
                                      <Typography
                                        variant="h5"
                                        className={styles.summary_Heading}
                                      >
                                        Refund Date & Time
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={8}
                                      className={styles.textAlignEnd}
                                    >
                                      <Typography
                                        variant="h5"
                                        className={styles.txt}
                                      >
                                        {`${ref.refund_date} ${ref.refund_time}`}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  {ref?.refund_transaction_id && (
                                    <Grid
                                      container
                                      xs={12}
                                      style={{ marginTop: "10px" }}
                                    >
                                      <Grid
                                        item
                                        xs={6}
                                        style={{ display: "flex" }}
                                      >
                                        <Typography
                                          variant="h5"
                                          className={styles.summary_Heading}
                                        >
                                          Refund Transaction ID
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={styles.textAlignEnd}
                                      >
                                        <Typography
                                          variant="h5"
                                          className={styles.txt}
                                        >
                                          {ref?.refund_transaction_id}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  )}
                                  <Grid
                                    container
                                    xs={12}
                                    md={12}
                                    sm={12}
                                    lg={12}
                                    style={{ marginTop: "10px" }}
                                  >
                                    <Grid item xs={7}>
                                      <Typography
                                        variant="h5"
                                        className={styles.summary_Heading}
                                      >
                                        Total Refund Amount
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={5}
                                      className={styles.textAlignEnd}
                                    >
                                      <Typography className={styles.header_1}>
                                        ${ref.total_refund_amount}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <Grid item className={styles.marginBlock16}>
                                    <Typography
                                      style={{
                                        color: "#FC68A2",
                                        fontFamily: "Inter SemiBold",
                                        fontSize: "16px",
                                        cursor: "pointer",
                                        paddingLeft: "0px",
                                      }}
                                      onClick={() =>
                                        handleRefundSummary(
                                          ref.refund_summary,
                                          ref.order_type
                                        )
                                      }
                                    >
                                      View Summary
                                    </Typography>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          ))}
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
              {/* Delivery Details */}
              {record?.delivery_type === "STORE_DELIVERY" &&
                record?.order_tracking?.del_person_detail?.name && (
                  <Grid item className={styles.marginTop30}>
                    <Grid
                      container
                      direction="column"
                      className={styles.address_box}
                    >
                      <Grid item className={styles.order_address_header}>
                        <Typography variant="h4" className={styles.side_header}>
                          Delivery Details
                        </Typography>
                      </Grid>
                      <Divider
                        orientation="horizontal"
                        flexItem
                        className={styles.divider}
                      />
                      <Grid item className={styles.shipping_detail}>
                        {/* Delivery Person Name */}
                        <Grid item>
                          <div className={styles.muted_header}>
                            Delivery Person Name
                          </div>
                          <div className={styles.details_txt}>
                            {capitalizeStr(
                              record?.order_tracking?.del_person_detail?.name
                            )}
                          </div>
                        </Grid>
                        {/* Contact Number */}
                        <Grid item className={styles.marginTop12}>
                          <div className={styles.muted_header}>
                            Contact Number
                          </div>
                          <div
                            className={styles.details_txt}
                          >{`(${record?.order_tracking?.del_person_detail?.country_code}) ${record?.order_tracking?.del_person_detail?.phone}`}</div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
            </Grid>
          </Grid>
        </Grid>
      )}
      {record?.order_type !== "CUSTOM" && refundSummary && (
        <RefundSummary
          open={record?.order_type !== "CUSTOM" && refundSummary}
          handleClose={handleCloseRefundSummary}
          refundInfo={refundInfo}
          order_id={record?.order_num}
          created_at={record?.created_at}
          mode={refundMode}
        />
      )}
      {record?.order_type === "CUSTOM" && refundSummary && (
        <CustomRefund
          open={record?.order_type === "CUSTOM" && refundSummary}
          handleClose={handleCloseRefundSummary}
          refundInfo={refundInfo}
          order_id={record?.order_num}
          created_at={record?.created_at}
        />
      )}
      <TransactionSummary
        open={transactionSummary}
        handleClose={handleCloseTransactionSummary}
        transactions={transactions}
      />
      <RescheduleAppointment
        header="Reschedule Request"
        openModal={rescheduleModal}
        handleRescheduleModal={handleRescheduleModal}
        id={record?.appointment?.id}
        DesignerId={designerId}
        storeList={storeList}
        storeId={prevStore}
        fetchAppointment={fetchOrders}
        {...props}
      />
      <Appointments
        open={appointments}
        handleClose={handelAppointments}
        list={record?.meeting_list}
        handleMeeting={handleMeeting}
      />
      <ScheduleFollowUp
        openModal={followUp}
        handleFollowUp={handelFollowUp}
        id={record?.appointment?.id}
        DesignerId={designerId}
        storeList={storeList}
        storeId={prevStore}
        fetchAppointment={fetchOrders}
        {...props}
      />
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(InstoreOrderDetails);
