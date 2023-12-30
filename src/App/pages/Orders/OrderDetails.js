/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Grid, Typography, withStyles, Divider, Box } from "@material-ui/core";
import {
  Toast,
  LoaderContent,
  OutlinedPrimaryButton,
  ChipButton,
} from "../../components";
import { API, ENDPOINTS } from "../../../api/apiService";
import styles from "./Orders.module.css";
import CancelOrder from "./components/CancelOrder";
import { convertDateFormat, getTime } from "../../../utils/dateUtils";
import { capitalize } from "../../../utils/textUtils";
import PaymentDetails from "../Cart/components/PaymentDetails";
import RefundDetails from "./components/RefundDetails";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepConnector from "@material-ui/core/StepConnector";
import Reschedule from "../../assets/icons/reschedule-clock.svg";
import CompleteIcon from "../../assets/icons/stepper-done.svg";
import AddNewReview from "../ProductDetail/components/AddNewReview";
import Lottie from "lottie-react";
import ImgLoader from "../../assets/imageLoader.json";
import moment from "moment/moment";
import RescheduleAppointment from "../Appointment/Cancel&Reschedule/RescheduleAppointment";
import Appointments from "./components/Appointments";
import ScheduleFollowUp from "../Appointment/Cancel&Reschedule/ScheduleFollowUp";
import { getFormattedDate, getNewerDateDays } from "../../commonFunction";

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 8px)",
    right: "calc(50% + 8px)",
  },
  active: {
    "& $line": {
      borderColor: "#fc68a2",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#fc68a2",
      fontWeight: 600,
    },
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 2,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#fc68a2",
    zIndex: 5,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#fc68a2",
    zIndex: 5,
    fontSize: 18,
    fontWeight: 600,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed || active ? (
        <img src={CompleteIcon} alt="complete" />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

function getCustomSteps() {
  return [
    {
      label: "Pending",
      date: "",
      time: "",
    },
    {
      label: "Confirmed",
      date: "",
      time: "",
    },
    {
      label: "In Progress",
      date: "",
      time: "",
    },
    {
      label: "Shipped",
      date: "",
      time: "",
    },
    {
      label: "Delivered",
    },
  ];
}

function getSteps() {
  return [
    {
      label: "Pending",
      date: "",
      time: "",
    },
    {
      label: "Confirmed",
      date: "",
      time: "",
    },
    {
      label: "Shipped",
      date: "",
      time: "",
    },
    {
      label: "Delivered",
    },
  ];
}

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

const OrderDetails = (props) => {
  const isLoggedIn = props?.isAuthenticated;
  const ID = props?.match?.params?.id;
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [record, setRecord] = useState([]);
  const [steps, setSteps] = useState(getSteps());
  const [payment, setPayment] = useState(null);
  const [openCancelOrder, setOpenCancelOrder] = useState(false);
  const [date, setDate] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [imgLoading, setImgLoading] = useState(true);
  const [InvoiceData, setInvoiceData] = useState(false);
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

  const handleRescheduleModal = (DesignerId, Store) => {
    setDesignerId(DesignerId);
    setRescheduleModal(!rescheduleModal);
    setPrevStore(Store);
  };

  const handleCancelOrder = async (data) => {
    if (!updating) {
      try {
        setUpdating(true);
        if (data.other_reason === "") {
          data.other_reason = null;
        }
        const payload = {
          order_status: "CANCELLED",
          cancel_reason: {
            reason: data.reason,
            other_reason: data.other_reason,
          },
          cancelled_by: "CUSTOMER",
        };
        const resp = await API.patch(`${ENDPOINTS.ORDERS}/${ID}`, payload);
        if (resp.success) {
          const result = resp.data;
          Toast.showSuccessToast(
            result.message || "Order cancelled successfully"
          );
          props.history.push("/orders");
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error cancelling order. Please try again`);
        setUpdating(false);
      }
    }
  };
  const handleInvoiceDownload = async () => {
    try {
      setLoading(true);
      const resp = await API.get(`${ENDPOINTS.INVOICE_DATA}/${ID}`);
      if (resp.success) {
        const temp = { ...resp.data };
        setInvoiceData(temp);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg || `Error downloading invoice. Please try again`
      );
    } finally {
      setLoading(false);
    }
  };
  const fillDateTime = (is_custom, num, date) => {
    let temp = [...steps];
    if (is_custom) {
      temp = getCustomSteps();
    }
    for (let i = 0; i <= num; i++) {
      temp[i].date = convertDateFormat(date[i]);
      temp[i].time = getTime(date[i]);
    }
    setSteps(temp);
  };
  const fetchRecord = async () => {
    try {
      setLoading(true);
      const resp = await API.get(`${ENDPOINTS.ORDERS}/${ID}`);
      if (resp.success) {
        const result = resp.data;
        setStatusColor(getStatusColor(result.order_status));
        const order_date = convertDateFormat(result.created_at);
        if (result.order_type === "CUSTOM") {
          setSteps(getCustomSteps());
          if (result.order_status === "PENDING") {
            fillDateTime(true, 0, [result.order_status_history["PENDING"]]);
          } else if (result.order_status === "ACCEPTED") {
            setActiveStep(1);
            fillDateTime(true, 1, [
              result.order_status_history["PENDING"],
              result.order_status_history["ACCEPTED"],
            ]);
          } else if (result.order_status === "IN_PROGRESS") {
            setActiveStep(2);
            fillDateTime(true, 2, [
              result.order_status_history["PENDING"],
              result.order_status_history["ACCEPTED"],
              result.order_status_history["IN_PROGRESS"],
            ]);
          } else if (result.order_status === "SHIPPED") {
            setActiveStep(3);
            fillDateTime(true, 3, [
              result.order_status_history["PENDING"],
              result.order_status_history["ACCEPTED"],
              result.order_status_history["IN_PROGRESS"],
              result.order_status_history["SHIPPED"],
            ]);
          }
        } else {
          if (result.order_status === "PENDING") {
            fillDateTime(false, 0, [result.order_status_history["PENDING"]]);
          } else if (result.order_status === "ACCEPTED") {
            setActiveStep(1);
            fillDateTime(false, 1, [
              result.order_status_history["PENDING"],
              result.order_status_history["ACCEPTED"],
            ]);
          } else if (result.order_status === "SHIPPED") {
            setActiveStep(2);
            fillDateTime(false, 2, [
              result.order_status_history["PENDING"],
              result.order_status_history["ACCEPTED"],
              result.order_status_history["SHIPPED"],
            ]);
          }
        }
        const Temp = {
          total_items: result.product_count,
          sub_total: result.sub_total,
          total_shipping_fee: result.shipping_fee,
          total_tax: result.tax,
          total_stripe_fee: result.stripe_fee,
          total_discount: result.discount,
          total_amount: result.total_amount,
          tax_details: result.tax_details,
        };
        setPayment(Temp);
        setRecord(result);
        setDate(order_date);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg || `Error Fetching Order Detail. Please Refresh`
      );
    } finally {
      setLoading(false);
    }
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
      fetchRecord();
      handleInvoiceDownload();
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Grid item xs={12} sm={9}>
              <Grid
                container
                spacing={2}
                className={styles.order_detail_header}
              >
                {/* Order-no */}
                <Grid item className={styles.center_align}>
                  <Typography
                    variant="h4"
                    className={styles.order_details_sideHeader}
                  >
                    #{`${record?.unique_order_id}`}
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
                    {`Online`}
                  </Typography>
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  className={styles.vertical_divider}
                />
                {/* Date of Order */}
                <Grid item className={styles.center_align}>
                  <Typography
                    className={styles.header_content}
                  >{`Date: ${date}`}</Typography>
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
                  >{`Total Price: $${
                    record?.total_amount
                      ? record?.total_amount?.toLocaleString()
                      : 0
                  }`}</Typography>
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
                  >{`Desginer: ${capitalize(
                    record?.designer?.first_name
                  )} ${capitalize(record?.designer?.last_name)}`}</Typography>
                </Grid>
                {/* Status */}
                <Grid item style={{ alignSelf: "center" }}>
                  <ChipButton
                    color={statusColor}
                    textColor="#242424"
                    label={
                      record.order_status === "IN_PROGRESS"
                        ? "In Progress"
                        : capitalize(record?.order_status)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Cancel Btn */}
            <Grid item xs={12} sm={3}>
              <Grid container justifyContent="space-between">
                {(record?.order_status === "PENDING" ||
                  record?.order_status === "ACCEPTED") && (
                  <OutlinedPrimaryButton
                    issecondary
                    size="large"
                    onClick={() => setOpenCancelOrder(true)}
                    className={styles.cancel_btn}
                  >
                    <Typography variant="h4" className={styles.cancel_btn_text}>
                      Cancel
                    </Typography>
                  </OutlinedPrimaryButton>
                )}
                {(record?.order_status === "PENDING" ||
                  record?.order_status === "ACCEPTED" ||
                  record?.order_status === "COMPLETED") &&
                  (record?.meeting_list.length > 0 ? (
                    (record?.appointment?.status === "CANCELLED" ||
                      record?.appointment?.status === "COMPLETED") && (
                      <OutlinedPrimaryButton
                        wide
                        size="large"
                        onClick={() =>
                          handelFollowUp(
                            record?.designer?.id,
                            record?.appointment?.store_id
                          )
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
                            product_id: record?.product?.map((item) =>
                              item.item_info
                                ? item.item_info.product
                                : item.product_id
                            ),
                            DesignerId: record?.designer?.id,
                            storeId: record?.appointment?.store_id
                              ? record?.appointment?.store_id
                              : null,
                            OrderItem: record?.product,
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
          {/* Order-Details */}
          <Grid item container className={styles.order_detail_box}>
            <Grid item container className={styles.order_list}>
              {/* Stepper */}
              {record?.order_status === "SHIPPED" ||
              record?.order_status === "PENDING" ||
              record?.order_status === "ACCEPTED" ||
              record?.order_status === "IN_PROGRESS" ? (
                <Grid container item className={styles.stepper}>
                  <Stepper
                    alternativeLabel
                    // orientation="vertical"
                    activeStep={activeStep}
                    connector={<QontoConnector />}
                    className={styles.stepper_div}
                  >
                    {steps.map((item) => (
                      <Step
                        key={item?.label}
                        style={
                          {
                            // width: record.order_type === "CUSTOM" ? 130 : 170,
                          }
                        }
                      >
                        <StepLabel StepIconComponent={QontoStepIcon}>
                          <Typography
                            variant="h4"
                            className={styles.cancel_btn_text}
                          >
                            {item?.label}
                          </Typography>
                          <Typography
                            variant="h4"
                            className={styles.status_time}
                          >
                            {item?.date}
                          </Typography>
                          <Typography
                            variant="h4"
                            className={styles.status_time}
                          >
                            {item?.time}
                          </Typography>
                          {item.label === "Shipped" &&
                            record.order_status === "SHIPPED" &&
                            record.tracking_url && (
                              // eslint-disable-next-line react/jsx-no-target-blank
                              <a
                                className={styles.link}
                                target="_blank"
                                href={record?.tracking_url}
                              >
                                <Typography
                                  variant="h4"
                                  className={styles.view_tracking}
                                >
                                  Tracking Link
                                </Typography>
                              </a>
                            )}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
              ) : null}
              {(record?.order_status === "SHIPPED" ||
                record?.order_status === "PENDING" ||
                record?.order_status === "ACCEPTED" ||
                record?.order_status === "IN_PROGRESS") && (
                <Box mb={2}>
                  <Grid item>
                    <Typography className={styles.total_text}>
                      Expected by{" "}
                      {getFormattedDate(
                        getNewerDateDays(new Date(), record?.max_delivery_days),
                        "mmddyyyy"
                      )}
                    </Typography>
                  </Grid>
                </Box>
              )}
              {/* Order List */}
              <Grid item container>
                {record?.product?.map((item, index) => (
                  <Grid
                    container
                    key={index}
                    className={styles.order_detail_info}
                    item
                    justifyContent="space-between"
                  >
                    <Grid container xs={12} sm={9} spacing={2}>
                      {/* Image */}
                      <Grid item>
                        <a
                          className={styles.link}
                          target="_blank"
                          href={
                            item?.item_info?.product_details?.is_custom
                              ? `/custom-product-details/${item?.item_info?.product_details?.parent_category}/${item.item_info?.product}`
                              : `/product-details/${item?.item_info?.product_details?.parent_category}/${item.item_info?.product}`
                          }
                        >
                          {imgLoading && (
                            <Lottie
                              className={styles.order_image}
                              animationData={ImgLoader}
                              style={{
                                width: 100,
                                height: 110,
                              }}
                            />
                          )}
                          <img
                            className={styles.order_image}
                            src={
                              item?.item_info?.product_details?.cover_image_url
                            }
                            alt={`${index}-img`}
                            style={{
                              display: imgLoading ? "none" : "inline",
                            }}
                            onLoad={() => setImgLoading(false)}
                          />
                        </a>
                      </Grid>
                      <Grid item>
                        {item?.item_info.product_type === "Custom" ? (
                          <Grid container direction="column">
                            {/* Product Name */}
                            <Grid item className={styles.order_info_title}>
                              <a
                                className={styles.link}
                                target="_blank"
                                href={`/custom-product-details/${item?.item_info?.product_details?.parent_category}/${item.item_info?.product}`}
                              >
                                <span className={styles.side_header}>
                                  {item?.item_info?.product_details?.title}
                                </span>
                              </a>
                              <span
                                className={styles.side_header}
                                style={{ marginLeft: 10 }}
                              >
                                {`$${item.price.toLocaleString()}`}
                              </span>
                            </Grid>
                            {/* Custom style */}
                            <Grid container direction="column">
                              <Grid item className={styles.info_grid}>
                                <span className={styles.label}>Style</span>
                              </Grid>
                              {/* Options */}
                              {item?.item_info?.options.map((sub) => (
                                <Grid
                                  key={sub.title}
                                  sub
                                  className={styles.style_grid}
                                >
                                  <span
                                    className={styles.order_info_content}
                                  >{`${sub?.title}: `}</span>
                                  <span className={styles.order_info_content}>
                                    {sub?.child_option?.title}
                                  </span>
                                </Grid>
                              ))}
                              {/* Materials */}
                              <Grid item className={styles.style_grid}>
                                <span
                                  className={styles.order_info_content}
                                >{`Material: `}</span>
                                <span className={styles.order_info_content}>
                                  {item?.item_info?.material
                                    ? item?.item_info?.material[0]?.title
                                    : "N/A"}
                                </span>
                              </Grid>
                            </Grid>
                            {/* Quantity */}
                            <Grid
                              item
                              container
                              alignItems="center"
                              className={styles.info_grid}
                            >
                              <Typography
                                variant="h4"
                                className={styles.quantity_label}
                              >
                                {`Quantity: `}
                              </Typography>
                              <Typography className={styles.order_info_content}>
                                {`${item?.item_info?.quantity || "1"}`}
                              </Typography>
                            </Grid>
                            {/* Size */}
                            <Grid item container>
                              <Grid item className={styles.info_grid} xs={12}>
                                {item?.item_info?.selected_size ? (
                                  <>
                                    <span className={styles.label}>
                                      {`Size: `}
                                    </span>
                                    <span className={styles.order_info_content}>
                                      {item?.item_info?.selected_size}
                                    </span>
                                  </>
                                ) : (
                                  <span className={styles.label}>Size</span>
                                )}
                              </Grid>
                              <Grid item container>
                                {item.item_info?.measurement
                                  ? Object.keys(
                                      item?.item_info?.measurement
                                    ).map((keyName, i) => (
                                      <Grid
                                        key={i}
                                        item
                                        xs={6}
                                        className={styles.style_grid}
                                      >
                                        <span
                                          className={styles.order_info_content}
                                        >{`${keyName}: `}</span>
                                        <span
                                          className={styles.order_info_content}
                                        >
                                          {
                                            item?.item_info?.measurement[
                                              keyName
                                            ]
                                          }
                                        </span>
                                      </Grid>
                                    ))
                                  : null}
                              </Grid>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container direction="column">
                            {/* Product Name */}
                            <Grid item className={styles.order_info_title}>
                              <Grid
                                container
                                justifyContent="space-between"
                                spacing={1}
                              >
                                <Grid item>
                                  <a
                                    className={styles.link}
                                    target="_blank"
                                    href={`/${
                                      item?.item_info?.product_details
                                        ?.is_custom
                                        ? `custom-`
                                        : ""
                                    }product-details/${
                                      item?.item_info?.product_details
                                        ?.parent_category
                                    }/${item.item_info?.product}`}
                                  >
                                    <span className={styles.side_header}>
                                      {item?.item_info?.product_details?.title}
                                    </span>
                                  </a>
                                </Grid>
                                <Grid item>
                                  <span className={styles.side_header}>
                                    {`$${item?.price?.toLocaleString()}`}
                                  </span>
                                </Grid>
                              </Grid>
                            </Grid>
                            {/* Product Size */}
                            <Grid item>
                              <Grid container justifyContent="space-between">
                                <Grid item xs={7}>
                                  <Typography
                                    variant="h4"
                                    className={styles.order_info_label}
                                  >
                                    {`Size: `}
                                  </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <Typography
                                    className={styles.order_info_content}
                                  >
                                    {`${
                                      item?.item_info?.selected_size || "N/A"
                                    }`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            {/* Color */}
                            <Grid item>
                              <Grid container justifyContent="space-between">
                                <Grid item xs={7}>
                                  <Typography
                                    variant="h4"
                                    className={styles.order_info_label}
                                  >
                                    {`Color: `}
                                  </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <Typography
                                    className={styles.order_info_content}
                                  >
                                    {`${item?.item_info?.colour || "N/A"}`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            {/* Quantity */}
                            <Grid item>
                              <Grid container justifyContent="space-between">
                                <Grid item xs={7}>
                                  <Typography
                                    variant="h4"
                                    className={styles.order_info_label}
                                  >
                                    {`Quantity: `}
                                  </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <Typography
                                    className={styles.order_info_content}
                                  >
                                    {`${item?.item_info?.quantity || "1"}`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                    {/*Add new Review*/}
                    {record.order_status === "DELIVERED" &&
                    item.product?.is_purchased ? (
                      <Grid item xs={12} sm={3} className={styles.review_btn_1}>
                        <AddNewReview
                          buttonTypeBlack={false}
                          product_id={item?.item_info?.product}
                          productTitle={item?.item_info?.product_details?.title}
                          fetchRecord={fetchRecord}
                        />
                      </Grid>
                    ) : null}
                  </Grid>
                ))}
              </Grid>
              {/* Cancel Reason */}
              {record.order_status === "CANCELLED" && (
                <Grid
                  container
                  direction="column"
                  item
                  className={styles.cancel_reason}
                >
                  <Grid item>
                    <Typography
                      variant="h4"
                      className={styles.order_info_label}
                    >
                      Reasons for cancellation
                    </Typography>
                  </Grid>
                  <Grid item>
                    {!!record.cancel_reason?.other_reason ? (
                      <Typography
                        variant="h4"
                        className={styles.address_content}
                      >
                        {record?.cancel_reason?.other_reason}
                      </Typography>
                    ) : (
                      <Typography
                        variant="h4"
                        className={styles.address_content}
                      >
                        {record?.cancel_reason?.reason}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2} className={styles.shipping_payment}>
              {/* Address Details */}
              <Grid item>
                <Grid
                  container
                  direction="column"
                  className={styles.address_box}
                >
                  <Grid item className={styles.order_address_header}>
                    <Typography variant="h4" className={styles.side_header}>
                      Shipping Details
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    className={styles.shipping_grid}
                  >
                    {/* Shipping Name */}
                    <Grid item container className={styles.shipping_detail}>
                      <Grid item>
                        <div className={styles.label}>Customer Name</div>
                        <div className={styles.detail_content}>
                          {`${record?.shipping?.first_name} ${record?.shipping?.last_name}`}
                        </div>
                      </Grid>
                    </Grid>
                    {/* Shipping phone number */}
                    <Grid item container className={styles.shipping_detail}>
                      <Grid item>
                        <div className={styles.label}>Phone Number</div>
                        <div className={styles.detail_content}>
                          {record?.shipping?.phone
                            ? `${record?.shipping?.country_code} - ${record?.shipping?.phone}`
                            : "N/A"}
                        </div>
                      </Grid>
                    </Grid>
                    {/* Delivery address */}
                    <Grid item container className={styles.shipping_detail}>
                      <Grid item>
                        <div className={styles.label}>Delivery Address</div>
                        <div className={styles.detail_content}>
                          {`${record?.shipping?.address_one}, ${record?.shipping?.address_two}, ${record?.shipping?.city}, ${record?.shipping?.state}, ${record?.shipping?.country}, ${record?.shipping?.zip_code}`}
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* Appointment Details */}
              {record?.appointment?.appointment_date && (
                <Grid item>
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
                      {record?.meeting_list?.length > 0 && (
                        <Grid item className={styles.order_address_header}>
                          <Typography
                            variant="h4"
                            className={styles.view_all}
                            onClick={handelAppointments}
                          >
                            View All
                          </Typography>
                        </Grid>
                      )}
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
                          {`${record?.appointment?.store_name} | ${record?.appointment?.appointment_number}`}
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
                                {capitalize(record?.appointment?.status)}
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
                                    record?.designer?.id,
                                    record?.appointment?.store_id
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
              {/* Shipping details */}
              <Grid item>
                <Grid container className={styles.payment_details}>
                  <PaymentDetails
                    data={payment}
                    hideButton={true}
                    title="Payment Summary"
                    totalText="Amount Paid"
                    handleInvoiceDownload={handleInvoiceDownload}
                    Invoice={true}
                    InvoiceData={InvoiceData}
                  />
                </Grid>
              </Grid>
              {/* Refund Details */}
              {record.order_status === "CANCELLED" ||
              record.order_status === "REJECTED" ? (
                <Grid container className={styles.payment_details}>
                  <RefundDetails data={record?.refund} />
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          <CancelOrder
            open={openCancelOrder}
            title="Cancel Order"
            handleClose={() => setOpenCancelOrder(false)}
            handleModalSubmit={handleCancelOrder}
          />
        </Grid>
      )}
      <RescheduleAppointment
        header="Reschedule Request"
        openModal={rescheduleModal}
        handleRescheduleModal={handleRescheduleModal}
        id={record?.appointment?.id}
        DesignerId={designerId}
        storeList={storeList}
        storeId={prevStore}
        fetchAppointment={fetchRecord}
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
        fetchAppointment={fetchRecord}
        {...props}
      />
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(OrderDetails);
